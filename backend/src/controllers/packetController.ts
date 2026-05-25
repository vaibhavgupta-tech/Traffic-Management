import type { Request, Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";
import { PacketModel } from "../models/Packet.js";
import { memoryStore } from "../services/memoryStore.js";
import type { PacketQuery } from "../types/packet.js";
import { packetsToCsv } from "../utils/csv.js";

export const packetQuerySchema = z.object({
  search: z.string().max(120).optional(),
  ip: z.string().ip().optional(),
  protocol: z.enum(["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP"]).optional(),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  packetType: z.enum(["inbound", "outbound", "lateral"]).optional(),
  severity: z.enum(["low", "medium", "high", "critical"]).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(5).max(100).default(25)
});

export async function listPackets(req: Request, res: Response) {
  const query = req.query as unknown as PacketQuery;
  if (mongoose.connection.readyState !== 1) {
    return res.json(memoryStore.listPackets(query));
  }

  const filter = toMongoFilter(query);
  const [rows, total] = await Promise.all([
    PacketModel.find(filter).sort({ timestamp: -1 }).skip((query.page - 1) * query.limit).limit(query.limit).lean(),
    PacketModel.countDocuments(filter)
  ]);

  res.json({
    data: rows.map(toPacketDto),
    total,
    page: query.page,
    limit: query.limit
  });
}

export async function getPacket(req: Request, res: Response) {
  const { id } = req.params;
  if (mongoose.connection.readyState !== 1) {
    const packet = memoryStore.findPacket(id);
    return packet ? res.json(packet) : res.status(404).json({ message: "Packet not found" });
  }

  const identifiers: Record<string, string>[] = [{ id }];
  if (mongoose.isValidObjectId(id)) identifiers.push({ _id: id });
  const packet = await PacketModel.findOne({ $or: identifiers }).lean();
  return packet ? res.json(toPacketDto(packet)) : res.status(404).json({ message: "Packet not found" });
}

export async function deletePacket(req: Request, res: Response) {
  const { id } = req.params;
  if (mongoose.connection.readyState !== 1) {
    const deleted = memoryStore.deletePacket(id);
    return deleted ? res.status(204).send() : res.status(404).json({ message: "Packet not found" });
  }

  const identifiers: Record<string, string>[] = [{ id }];
  if (mongoose.isValidObjectId(id)) identifiers.push({ _id: id });
  const result = await PacketModel.deleteOne({ $or: identifiers });
  return result.deletedCount ? res.status(204).send() : res.status(404).json({ message: "Packet not found" });
}

export async function exportPackets(req: Request, res: Response) {
  const format = z.enum(["csv", "json"]).parse(req.params.format);
  const parsed = packetQuerySchema.parse(req.query);
  const query = { ...parsed, page: 1, limit: 5000 } as PacketQuery;
  let packets = memoryStore.allPackets(query);

  if (mongoose.connection.readyState === 1) {
    const rows = await PacketModel.find(toMongoFilter(query)).sort({ timestamp: -1 }).limit(5000).lean();
    packets = rows.map(toPacketDto);
  }

  if (format === "json") {
    res.setHeader("Content-Disposition", "attachment; filename=sentineldpi-packets.json");
    return res.json(packets);
  }

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=sentineldpi-packets.csv");
  return res.send(packetsToCsv(packets));
}

function toMongoFilter(query: PacketQuery) {
  const filter: Record<string, unknown> = {};
  if (query.ip) filter.$or = [{ sourceIp: query.ip }, { destinationIp: query.ip }];
  if (query.protocol) filter.protocol = query.protocol;
  if (query.port) filter.port = query.port;
  if (query.packetType) filter.packetType = query.packetType;
  if (query.severity) filter.severity = query.severity;
  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.from || query.to) {
    filter.timestamp = {
      ...(query.from ? { $gte: new Date(query.from) } : {}),
      ...(query.to ? { $lte: new Date(query.to) } : {})
    };
  }
  return filter;
}

function toPacketDto(row: any) {
  return {
    id: row.id ?? String(row._id),
    sourceIp: row.sourceIp,
    destinationIp: row.destinationIp,
    protocol: row.protocol,
    port: row.port,
    size: row.size,
    timestamp: new Date(row.timestamp).toISOString(),
    packetType: row.packetType,
    action: row.action,
    severity: row.severity,
    payloadSignature: row.payloadSignature,
    geo: row.geo,
    tags: row.tags ?? []
  };
}
