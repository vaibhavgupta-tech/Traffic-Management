import { stringify } from "csv-stringify/sync";
import type { PacketLog } from "../types/packet.js";

export function packetsToCsv(packets: PacketLog[]) {
  return stringify(
    packets.map((packet) => ({
      id: packet.id,
      sourceIp: packet.sourceIp,
      destinationIp: packet.destinationIp,
      protocol: packet.protocol,
      port: packet.port,
      size: packet.size,
      timestamp: packet.timestamp,
      packetType: packet.packetType,
      action: packet.action,
      severity: packet.severity,
      payloadSignature: packet.payloadSignature,
      tags: packet.tags.join("|")
    })),
    { header: true }
  );
}
