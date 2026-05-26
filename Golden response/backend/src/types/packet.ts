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
  category: "suspicious_ip" | "port_scan" | "traffic_spike" | "malformed_packet" | "risky_port";
  acknowledged: boolean;
  createdAt: string;
}

export interface PacketQuery {
  search?: string;
  ip?: string;
  protocol?: Protocol;
  port?: number;
  packetType?: PacketDirection;
  severity?: Severity;
  from?: string;
  to?: string;
  page: number;
  limit: number;
}
