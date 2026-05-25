import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PacketModel } from "../models/Packet.js";
import { ThreatAlertModel } from "../models/ThreatAlert.js";
import { memoryStore } from "../services/memoryStore.js";
import type { PacketLog } from "../types/packet.js";

export async function dashboardAnalytics(_req: Request, res: Response) {
  let packets = memoryStore.allPackets();
  let alerts = memoryStore.listAlerts(100);

  if (mongoose.connection.readyState === 1) {
    const [packetRows, alertRows] = await Promise.all([
      PacketModel.find().sort({ timestamp: -1 }).limit(2000).lean(),
      ThreatAlertModel.find().sort({ createdAt: -1 }).limit(100).lean()
    ]);
    packets = packetRows.map((row: any) => ({ ...row, id: row.id ?? String(row._id), timestamp: new Date(row.timestamp).toISOString() }));
    alerts = alertRows.map((row: any) => ({ ...row, id: row.id ?? String(row._id), createdAt: new Date(row.createdAt).toISOString() }));
  }

  const totalBytes = packets.reduce((sum, packet) => sum + packet.size, 0);
  const blocked = packets.filter((packet) => packet.action === "blocked").length;
  const flagged = packets.filter((packet) => packet.action === "flagged").length;

  res.json({
    totals: {
      packets: packets.length,
      bytes: totalBytes,
      alerts: alerts.length,
      blocked,
      flagged
    },
    protocolStats: countBy(packets, "protocol"),
    severityStats: countBy(packets, "severity"),
    trafficTimeline: buildTimeline(packets),
    topIps: topIps(packets),
    alerts: alerts.slice(0, 8)
  });
}

function countBy<T extends keyof PacketLog>(packets: PacketLog[], key: T) {
  const counts = new Map<string, number>();
  packets.forEach((packet) => counts.set(String(packet[key]), (counts.get(String(packet[key])) ?? 0) + 1));
  return Array.from(counts, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function buildTimeline(packets: PacketLog[]) {
  const buckets = new Map<string, { time: string; packets: number; bytes: number }>();
  packets.forEach((packet) => {
    const date = new Date(packet.timestamp);
    const key = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    const current = buckets.get(key) ?? { time: key, packets: 0, bytes: 0 };
    current.packets += 1;
    current.bytes += packet.size;
    buckets.set(key, current);
  });
  return Array.from(buckets.values()).slice(0, 24).reverse();
}

function topIps(packets: PacketLog[]) {
  const counts = new Map<string, number>();
  packets.forEach((packet) => {
    counts.set(packet.sourceIp, (counts.get(packet.sourceIp) ?? 0) + 1);
  });
  return Array.from(counts, ([ip, count]) => ({ ip, count })).sort((a, b) => b.count - a.count).slice(0, 8);
}
