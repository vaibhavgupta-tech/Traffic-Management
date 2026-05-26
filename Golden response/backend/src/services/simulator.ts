import type { Server } from "socket.io";
import type { PacketLog, Protocol } from "../types/packet.js";
import { env } from "../config/env.js";
import { makeId } from "../utils/ids.js";
import { memoryStore } from "./memoryStore.js";
import { analyzePacket } from "./threatDetection.js";
import { PacketModel } from "../models/Packet.js";
import { ThreatAlertModel } from "../models/ThreatAlert.js";

const protocols: Protocol[] = ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP"];
const ports = [22, 23, 53, 80, 123, 443, 445, 993, 1433, 3306, 3389, 5900, 8080];
const geos = ["IN-MH", "US-VA", "DE-HE", "SG-01", "GB-LND", "JP-13"];
let timer: NodeJS.Timeout | undefined;
let databaseEnabled = false;

export function setSimulatorDatabase(enabled: boolean) {
  databaseEnabled = enabled;
}

export function startSimulator(io: Server) {
  if (timer) return;
  timer = setInterval(() => publishPacket(io), env.SIMULATOR_INTERVAL_MS);
}

export function stopSimulator() {
  if (timer) clearInterval(timer);
  timer = undefined;
}

export async function publishPacket(io: Server) {
  const packet = createPacket();
  memoryStore.addPacket(packet);

  if (databaseEnabled) {
    await PacketModel.create({ ...packet, timestamp: new Date(packet.timestamp) }).catch(() => undefined);
  }

  const alerts = analyzePacket(packet);
  alerts.forEach((alert) => memoryStore.addAlert(alert));
  if (databaseEnabled && alerts.length > 0) {
    await ThreatAlertModel.insertMany(alerts.map((alert) => ({ ...alert, createdAt: new Date(alert.createdAt) }))).catch(() => undefined);
  }

  io.emit("packet:new", packet);
  alerts.forEach((alert) => io.emit("alert:new", alert));
}

function createPacket(): PacketLog {
  const protocol = pick(protocols);
  const sourceIp = Math.random() > 0.92 ? pick(["45.155.205.233", "185.220.101.14", "103.167.150.91"]) : randomIp();
  const port = protocol === "DNS" ? 53 : protocol === "HTTPS" ? 443 : protocol === "HTTP" ? 80 : pick(ports);
  const severity = sourceIp.startsWith("45.") || port === 23 ? "high" : Math.random() > 0.82 ? "medium" : "low";
  const action = severity === "high" ? "flagged" : Math.random() > 0.92 ? "blocked" : "allowed";

  return {
    id: makeId("pkt"),
    sourceIp,
    destinationIp: randomPrivateIp(),
    protocol,
    port,
    size: Math.floor(64 + Math.random() * 8400),
    timestamp: new Date().toISOString(),
    packetType: pick(["inbound", "outbound", "lateral"]),
    action,
    severity,
    payloadSignature: pick(["TLS_CLIENT_HELLO", "DNS_QUERY", "HTTP_POST", "SYN", "ACK", "ICMP_ECHO", "SSH_KEX", "MYSQL_HANDSHAKE"]),
    geo: pick(geos),
    tags: action === "flagged" ? ["dpi-match", "review"] : ["baseline"]
  };
}

function pick<T>(items: readonly T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomIp() {
  return `${rand(11, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
}

function randomPrivateIp() {
  return `10.${rand(0, 12)}.${rand(0, 255)}.${rand(1, 254)}`;
}

function rand(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}
