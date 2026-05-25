# server\src\services\threatDetection.ts



``ts
import { Packet, PacketDocument } from "../models/Packet.js";
import { ThreatAlert } from "../models/ThreatAlert.js";


const suspiciousPorts = new Set([21, 22, 23, 3389, 4444, 5900]);
const suspiciousIps = new Set(["45.155.205.233", "185.220.101.44", "91.240.118.172"]);


export async function inspectPacket(packet: Partial<PacketDocument> & { _id?: unknown; sourceIp: string; port: number }) {
  const alerts = [];
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);


  if (suspiciousIps.has(packet.sourceIp)) {
    alerts.push({
      severity: "critical",
      type: "Suspicious IP",
      sourceIp: packet.sourceIp,
      description: `Traffic from known suspicious source ${packet.sourceIp}`,
      packetId: packet._id
    });
  }


  if (suspiciousPorts.has(packet.port)) {
    alerts.push({
      severity: packet.port === 23 ? "high" : "medium",
      type: "Sensitive Port Access",
      sourceIp: packet.sourceIp,
      description: `Connection attempt on monitored port ${packet.port}`,
      packetId: packet._id
    });
  }


  const [recentBySource, uniquePorts] = await Promise.all([
    Packet.countDocuments({ sourceIp: packet.sourceIp, timestamp: { $gte: fiveMinutesAgo } }),
    Packet.distinct("port", { sourceIp: packet.sourceIp, timestamp: { $gte: fiveMinutesAgo } })
  ]);


  if (recentBySource > 120) {
    alerts.push({
      severity: "high",
      type: "High Traffic Warning",
      sourceIp: packet.sourceIp,
      description: `${packet.sourceIp} generated ${recentBySource} packets in the last five minutes`,
      packetId: packet._id
    });
  }


  if (uniquePorts.length >= 12) {
    alerts.push({
      severity: "critical",
      type: "Port Scan",
      sourceIp: packet.sourceIp,
      description: `${packet.sourceIp} contacted ${uniquePorts.length} unique ports in five minutes`,
      packetId: packet._id
    });
  }


  return alerts.length ? ThreatAlert.insertMany(alerts) : [];
}


server\src\utils\query.ts
``ts
import Joi from "joi";
export const packetQuerySchema = Joi.object({
page: Joi.number().integer().min(1).default(1),
limit: Joi.number().integer().min(1).max(100).default(25),
search: Joi.string().allow("").max(80),
sourceIp: Joi.string().allow("").max(80),
destinationIp: Joi.string().allow("").max(80),
protocol: Joi.string().valid("TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP", "OTHER", ""),
port: Joi.number().integer().min(0).max(65535),
packetType: Joi.string().valid("inbound", "outbound", "internal", ""),
from: Joi.date().iso(),
to: Joi.date().iso()
});
export const exportPacketQuerySchema = packetQuerySchema.keys({
format: Joi.string().valid("csv", "json").default("json")
});
export const packetBodySchema = Joi.object({
sourceIp: Joi.string().ip({ version: ["ipv4", "ipv6"], cidr: "forbidden" }).required(),
destinationIp: Joi.string().ip({ version: ["ipv4", "ipv6"], cidr: "forbidden" }).required(),
protocol: Joi.string().valid("TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP", "OTHER").required(),
port: Joi.number().integer().min(0).max(65535).required(),
size: Joi.number().integer().min(0).max(65535).required(),
packetType: Joi.string().valid("inbound", "outbound", "internal").required(),
payloadPreview: Joi.string().allow("").max(200).default("")
});
export function buildPacketFilter(query: Record<string, unknown>) {
const filter: Record<string, unknown> = {};
if (query.sourceIp) filter.sourceIp = new RegExp(String(query.sourceIp), "i");
if (query.destinationIp) filter.destinationIp = new RegExp(String(query.destinationIp), "i");
if (query.protocol) filter.protocol = query.protocol;
if (query.port !== undefined) filter.port = Number(query.port);
if (query.packetType) filter.packetType = query.packetType;
if (query.search) {
filter.$or = [
{ sourceIp: new RegExp(String(query.search), "i") },
{ destinationIp: new RegExp(String(query.search), "i") },
{ protocol: new RegExp(String(query.search), "i") }
];
}
if (query.from || query.to) {
filter.timestamp = {};
if (query.from) (filter.timestamp as Record<string, Date>).$gte = new Date(String(query.from));
if (query.to) (filter.timestamp as Record<string, Date>).$lte = new Date(String(query.to));
}
return filter;
}


