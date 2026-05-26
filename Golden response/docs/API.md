# SentinelDPI API

Base URL: `http://localhost:4000/api`

## Health

```http
GET /health
```

## Packets

```http
GET /packets?page=1&limit=25&search=10.0.0.1&protocol=TCP&severity=high
```

Supported filters:

- `search`: packet ID, IP, protocol, payload signature
- `ip`: exact source or destination IP
- `protocol`: `TCP`, `UDP`, `ICMP`, `HTTP`, `HTTPS`, `DNS`, `SSH`, `FTP`
- `port`: `1-65535`
- `packetType`: `inbound`, `outbound`, `lateral`
- `severity`: `low`, `medium`, `high`, `critical`
- `from`, `to`: ISO datetime strings
- `page`, `limit`: paginated log access

```http
GET /packets/:id
DELETE /packets/:id
GET /packets/export/csv
GET /packets/export/json
```

## Threat Alerts

```http
GET /alerts
PATCH /alerts/:id/acknowledge
```

## Analytics

```http
GET /analytics/dashboard
```

Returns:

- packet totals
- byte volume
- blocked and flagged counts
- protocol usage
- severity distribution
- traffic timeline
- top active source IP addresses
- latest threat alerts

## Simulator

```http
POST /simulator/start
POST /simulator/stop
```

The simulator generates realistic demo traffic and emits events over Socket.io:

- `packet:new`
- `alert:new`
- `system:ready`
