# client\src\styles.css



``css
@tailwind base;
@tailwind components;
@tailwind utilities;


* {
  box-sizing: border-box;
}


body {
  margin: 0;
  background: #071014;
  color: #e2e8f0;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}


@layer components {
  .input {
    @apply h-10 w-full rounded border border-line bg-ink px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan;
  }


  .btn {
    @apply inline-flex h-9 items-center justify-center gap-2 rounded border border-line bg-white/[0.03] px-3 text-sm text-slate-200 transition hover:border-cyan/50 hover:text-cyan disabled:cursor-not-allowed disabled:opacity-40;
  }
}


client\src\types\network.ts
``ts
export type Protocol = "TCP" | "UDP" | "ICMP" | "HTTP" | "HTTPS" | "DNS" | "SSH" | "FTP" | "OTHER";
export type PacketType = "inbound" | "outbound" | "internal";
export interface Packet {
_id: string;
sourceIp: string;
destinationIp: string;
protocol: Protocol;
port: number;
size: number;
packetType: PacketType;
payloadPreview?: string;
timestamp: string;
}
export interface ThreatAlert {
_id: string;
severity: "low" | "medium" | "high" | "critical";
type: string;
sourceIp: string;
description: string;
status: "open" | "investigating" | "resolved";
timestamp: string;
}
export interface DashboardData {
totalPackets: number;
openAlerts: number;
protocolStats: Array<{ _id: string; value: number }>;
topIps: Array<{ _id: string; packets: number; bytes: number }>;
timeline: Array<{ _id: string; packets: number; bytes: number }>;
alerts: ThreatAlert[];
}
export interface PacketFilters {
search: string;
sourceIp: string;
destinationIp: string;
protocol: string;
port: string;
packetType: string;
from: string;
to: string;
}


