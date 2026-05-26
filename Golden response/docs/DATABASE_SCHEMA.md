# Database Schema

MongoDB collections are defined with Mongoose models in `backend/src/models`.

## Packet Logs

Collection: `packets`

```ts
{
  sourceIp: string;
  destinationIp: string;
  protocol: "TCP" | "UDP" | "ICMP" | "HTTP" | "HTTPS" | "DNS" | "SSH" | "FTP";
  port: number;
  size: number;
  timestamp: Date;
  packetType: "inbound" | "outbound" | "lateral";
  action: "allowed" | "blocked" | "flagged";
  severity: "low" | "medium" | "high" | "critical";
  payloadSignature: string;
  geo?: string;
  tags: string[];
}
```

Indexes:

- `sourceIp`
- `destinationIp`
- `protocol`
- `port`
- `timestamp`
- `packetType`
- `severity`
- text index across source IP, destination IP, protocol, and signature

## Threat Alerts

Collection: `threatalerts`

```ts
{
  packetId?: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  sourceIp?: string;
  destinationIp?: string;
  category: "suspicious_ip" | "port_scan" | "traffic_spike" | "malformed_packet" | "risky_port";
  acknowledged: boolean;
  createdAt: Date;
}
```

## User Activity

Collection: `useractivities`

```ts
{
  actor: string;
  action: string;
  ipAddress?: string;
  metadata?: Record<string, unknown>;
}
```

## Analytics Data

The current implementation computes dashboard analytics from packet and alert logs. For very large deployments, create a scheduled aggregation collection with minute, hour, and day buckets:

```ts
{
  bucket: Date;
  granularity: "minute" | "hour" | "day";
  protocolCounts: Record<string, number>;
  severityCounts: Record<string, number>;
  totalPackets: number;
  totalBytes: number;
  alertCount: number;
}
```
