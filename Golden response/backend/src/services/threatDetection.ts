import type { PacketLog, Severity, ThreatAlert } from "../types/packet.js";
import { makeId } from "../utils/ids.js";

const suspiciousIps = new Set(["45.155.205.233", "185.220.101.14", "103.167.150.91", "91.240.118.172"]);
const riskyPorts = new Set([22, 23, 445, 3389, 5900, 8080]);
const recentByIp = new Map<string, PacketLog[]>();

export function analyzePacket(packet: PacketLog): ThreatAlert[] {
  const alerts: ThreatAlert[] = [];
  const now = Date.now();
  const recent = (recentByIp.get(packet.sourceIp) ?? []).filter((item) => now - Date.parse(item.timestamp) < 60_000);
  recent.unshift(packet);
  recentByIp.set(packet.sourceIp, recent.slice(0, 100));

  if (suspiciousIps.has(packet.sourceIp)) {
    alerts.push(createAlert(packet, "suspicious_ip", "Suspicious source IP detected", "Known hostile infrastructure matched reputation intelligence.", "critical"));
  }

  if (riskyPorts.has(packet.port)) {
    alerts.push(createAlert(packet, "risky_port", "Risky service port accessed", `Traffic targeted sensitive port ${packet.port}.`, packet.port === 23 ? "high" : "medium"));
  }

  const uniquePorts = new Set(recent.map((item) => item.port));
  if (uniquePorts.size >= 8) {
    alerts.push(createAlert(packet, "port_scan", "Port scanning behavior", "Source IP touched multiple destination ports within a short window.", "high"));
  }

  const bytesPerMinute = recent.reduce((sum, item) => sum + item.size, 0);
  if (bytesPerMinute > 85_000) {
    alerts.push(createAlert(packet, "traffic_spike", "High traffic warning", "Traffic volume crossed the one-minute threshold for this source.", "medium"));
  }

  if (packet.size < 40 || packet.size > 9000) {
    alerts.push(createAlert(packet, "malformed_packet", "Malformed packet size", "Packet size is outside expected Ethernet/IP ranges.", "medium"));
  }

  return alerts;
}

function createAlert(packet: PacketLog, category: ThreatAlert["category"], title: string, description: string, severity: Severity): ThreatAlert {
  return {
    id: makeId("alert"),
    packetId: packet.id,
    title,
    description,
    severity,
    category,
    sourceIp: packet.sourceIp,
    destinationIp: packet.destinationIp,
    acknowledged: false,
    createdAt: new Date().toISOString()
  };
}
