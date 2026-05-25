import express from "express";
import http from "node:http";
import compression from "compression";
import morgan from "morgan";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { apiLimiter, cleanQuery, corsPolicy, sanitizeMongo, securityHeaders } from "./middleware/security.js";
import { packetRouter } from "./routes/packets.js";
import { alertRouter } from "./routes/alerts.js";
import { analyticsRouter } from "./routes/analytics.js";
import { createSimulatorRouter } from "./routes/simulator.js";
import { setSimulatorDatabase, startSimulator } from "./services/simulator.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_ORIGIN,
    credentials: true
  }
});

instrument(io, { auth: false, mode: env.NODE_ENV === "production" ? "production" : "development" });

app.use(securityHeaders);
app.use(corsPolicy);
app.use(compression());
app.use(express.json({ limit: "512kb" }));
app.use(sanitizeMongo);
app.use(cleanQuery);
app.use(apiLimiter);
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "SentinelDPI API", timestamp: new Date().toISOString() });
});

app.use("/api/packets", packetRouter);
app.use("/api/alerts", alertRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/simulator", createSimulatorRouter(io));

io.on("connection", (socket) => {
  socket.emit("system:ready", { message: "Connected to SentinelDPI live packet stream" });
});

const dbEnabled = await connectDatabase();
setSimulatorDatabase(dbEnabled);

if (env.SIMULATOR_ENABLED) {
  startSimulator(io);
}

server.listen(env.PORT, () => {
  console.log(`SentinelDPI API listening on http://localhost:${env.PORT}`);
});
