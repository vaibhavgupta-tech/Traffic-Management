import type { PacketLog, PacketQuery, ThreatAlert } from "../types/packet.js";

const packets: PacketLog[] = [];
const alerts: ThreatAlert[] = [];

export const memoryStore = {
  addPacket(packet: PacketLog) {
    packets.unshift(packet);
    if (packets.length > 5000) packets.pop();
    return packet;
  },
  addAlert(alert: ThreatAlert) {
    alerts.unshift(alert);
    if (alerts.length > 1000) alerts.pop();
    return alert;
  },
  listPackets(query: PacketQuery) {
    const filtered = filterPackets(packets, query);
    const start = (query.page - 1) * query.limit;
    return {
      data: filtered.slice(start, start + query.limit),
      total: filtered.length,
      page: query.page,
      limit: query.limit
    };
  },
  allPackets(query: Partial<PacketQuery> = {}) {
    return filterPackets(packets, { page: 1, limit: 5000, ...query } as PacketQuery);
  },
  findPacket(id: string) {
    return packets.find((packet) => packet.id === id);
  },
  deletePacket(id: string) {
    const index = packets.findIndex((packet) => packet.id === id);
    if (index === -1) return false;
    packets.splice(index, 1);
    return true;
  },
  listAlerts(limit = 50) {
    return alerts.slice(0, limit);
  },
  acknowledgeAlert(id: string) {
    const alert = alerts.find((item) => item.id === id);
    if (!alert) return undefined;
    alert.acknowledged = true;
    return alert;
  },
  counts() {
    return { packetCount: packets.length, alertCount: alerts.length };
  }
};

function filterPackets(source: PacketLog[], query: PacketQuery) {
  return source.filter((packet) => {
    const search = query.search?.toLowerCase();
    const timestamp = Date.parse(packet.timestamp);
    if (search) {
      const target = `${packet.id} ${packet.sourceIp} ${packet.destinationIp} ${packet.protocol} ${packet.payloadSignature}`.toLowerCase();
      if (!target.includes(search)) return false;
    }
    if (query.ip && packet.sourceIp !== query.ip && packet.destinationIp !== query.ip) return false;
    if (query.protocol && packet.protocol !== query.protocol) return false;
    if (query.port && packet.port !== query.port) return false;
    if (query.packetType && packet.packetType !== query.packetType) return false;
    if (query.severity && packet.severity !== query.severity) return false;
    if (query.from && timestamp < Date.parse(query.from)) return false;
    if (query.to && timestamp > Date.parse(query.to)) return false;
    return true;
  });
}
