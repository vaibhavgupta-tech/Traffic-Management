export type Protocol = "TCP" | "UDP" | "ICMP" | "HTTP" | "HTTPS" | "DNS" | "SSH" | "FTP";
export type PacketDirection = "inbound" | "outbound" | "lateral";
export type PacketAction = "allowed" | "blocked" | "flagged";
export type Severity = "low" | "medium" | "high" | "critical";

export interface PacketLog {
  id: string;
  sourceIp: string;
  destinationIp: string;
  protocol: Protocol;
  port: number;
  size: number;
  timestamp: string;
  packetType: PacketDirection;
  action: PacketAction;
  severity: Severity;
  payloadSignature: string;
  geo?: string;
  tags: string[];
}

export interface ThreatAlert {
  id: string;
  packetId?: string;
  title: string;
  description: string;
  severity: Severity;
  sourceIp?: string;
  destinationIp?: string;
  category: string;
  acknowledged: boolean;
  createdAt: string;
}

export interface DashboardAnalytics {
  totals: {
    packets: number;
    bytes: number;
    alerts: number;
    blocked: number;
    flagged: number;
  };
  protocolStats: { name: string; value: number }[];
  severityStats: { name: string; value: number }[];
  trafficTimeline: { time: string; packets: number; bytes: number }[];
  topIps: { ip: string; count: number }[];
  alerts: ThreatAlert[];
}

export interface PacketResponse {
  data: PacketLog[];
  total: number;
  page: number;
  limit: number;
}
