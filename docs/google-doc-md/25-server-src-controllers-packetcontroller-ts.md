# server\src\controllers\packetController.ts



``ts
import { Request, Response } from "express";
import { stringify } from "csv-stringify/sync";
import { Packet } from "../models/Packet.js";
import { ThreatAlert } from "../models/ThreatAlert.js";
import { UserActivity } from "../models/UserActivity.js";
import { inspectPacket } from "../services/threatDetection.js";
import { buildPacketFilter } from "../utils/query.js";


export async function getPackets(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 25);
  const filter = buildPacketFilter(req.query);
  const [items, total] = await Promise.all([
    Packet.find(filter).sort({ timestamp: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Packet.countDocuments(filter)
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
}


export async function createPacket(req: Request, res: Response) {
  const packet = await Packet.create(req.body);
  const alerts = await inspectPacket(packet.toObject());
  req.app.get("io")?.emit("packet:new", packet);
  alerts.forEach((alert) => req.app.get("io")?.emit("alert:new", alert));
  await UserActivity.create({ actor: "api", action: "packet.ingested", ipAddress: req.ip, metadata: { packetId: packet._id } });
  res.status(201).json({ packet, alerts });
}


export async function deletePackets(req: Request, res: Response) {
  const filter = buildPacketFilter(req.query);
  const result = await Packet.deleteMany(filter);
  await UserActivity.create({ actor: "api", action: "logs.deleted", ipAddress: req.ip, metadata: { filter, deleted: result.deletedCount } });
  res.json({ deleted: result.deletedCount });
}


export async function exportPackets(req: Request, res: Response) {
  const format = String(req.query.format ?? "json");
  const packets = await Packet.find(buildPacketFilter(req.query)).sort({ timestamp: -1 }).limit(5000).lean();
  if (format === "csv") {
    const csv = stringify(packets, { header: true, columns: ["sourceIp", "destinationIp", "protocol", "port", "size", "packetType", "timestamp"] });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=packet-logs.csv");
    return res.send(csv);
  }
  res.setHeader("Content-Disposition", "attachment; filename=packet-logs.json");
  return res.json(packets);
}


export async function getDashboard(req: Request, res: Response) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [totalPackets, protocolStats, topIps, timeline, alerts, openAlerts] = await Promise.all([
    Packet.countDocuments(),
    Packet.aggregate([{ $group: { _id: "$protocol", value: { $sum: 1 } } }, { $sort: { value: -1 } }]),
    Packet.aggregate([{ $group: { _id: "$sourceIp", packets: { $sum: 1 }, bytes: { $sum: "$size" } } }, { $sort: { packets: -1 } }, { $limit: 8 }]),
    Packet.aggregate([
      { $match: { timestamp: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%H:%M", date: "$timestamp" } }, packets: { $sum: 1 }, bytes: { $sum: "$size" } } },
      { $sort: { _id: 1 } }
    ]),
    ThreatAlert.find().sort({ timestamp: -1 }).limit(8).lean(),
    ThreatAlert.countDocuments({ status: { $ne: "resolved" } })
  ]);
  res.json({ totalPackets, protocolStats, topIps, timeline, alerts, openAlerts });
}


export async function getAlerts(_req: Request, res: Response) {
  const alerts = await ThreatAlert.find().sort({ timestamp: -1 }).limit(100).lean();
  res.json(alerts);
}


export async function updateAlert(req: Request, res: Response) {
  const alert = await ThreatAlert.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
  if (!alert) return res.status(404).json({ message: "Alert not found" });
  await UserActivity.create({ actor: "api", action: "alert.updated", ipAddress: req.ip, metadata: { alertId: alert._id, status: alert.status } });
  res.json(alert);
}


server\src\index.ts
``ts
import http from "http";
import express from "express";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDatabase } from "./config/db.js";
import { env } from "./config/env.js";
import { securityMiddleware } from "./middleware/security.js";
import { alertRouter } from "./routes/alerts.js";
import { packetRouter } from "./routes/packets.js";
import { startPacketSimulator } from "./services/packetSimulator.js";
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: env.clientOrigin, credentials: true } });
app.set("io", io);
securityMiddleware(app);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.get("/health", (_req, res) => res.json({ status: "ok", service: "dpi-soc-monitor" }));
app.use("/api/packets", packetRouter);
app.use("/api/alerts", alertRouter);
app.use((_req, res) => res.status(404).json({ message: "Route not found" }));
io.on("connection", (socket) => {
socket.emit("socket:ready", { connected: true });
});
await connectDatabase();
if (env.simulatePackets) startPacketSimulator(io);
server.listen(env.port, () => {
console.log(DPI API listening on http://localhost:${env.port});
});


