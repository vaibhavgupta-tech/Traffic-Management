# SentinelDPI - Deep Packet Inspection SOC Dashboard

SentinelDPI is a portfolio-ready full-stack cybersecurity project for monitoring, analyzing, filtering, and managing network packet traffic in real time.

It ships with a realistic packet simulator so the project works immediately on a laptop. In production or lab environments, the simulator can be replaced with a Python/pcap collector that writes packets to the same REST API or emits Socket.io events.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Node.js + Express + TypeScript
- Socket.io real-time packet stream
- MongoDB with Mongoose, with in-memory fallback for demos
- Recharts analytics
- Zod validation, Helmet, CORS, rate limiting, Mongo sanitize, XSS-safe output patterns

## Folder Structure

```txt
dpi-soc-monitor/
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      types/
      utils/
      server.ts
  frontend/
    src/
      components/
      hooks/
      lib/
      types/
      App.tsx
  docs/
    API.md
    DATABASE_SCHEMA.md
    DEPLOYMENT.md
```

## Quick Start

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:4000/api`

Socket.io: `http://localhost:4000`

## Environment Variables

Copy the examples and adjust values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

MongoDB is optional for demos. Without `MONGODB_URI`, the API uses an in-memory store and still supports live packets, filtering, alerts, CSV/JSON export, pagination, and dashboard analytics.

## Main Features

- Real-time packet table with protocol, source/destination IP, port, size, timestamp, action, and risk
- Dashboard KPIs, protocol distribution, traffic timeline, top active IPs, and threat summaries
- Threat rules for suspicious IPs, high packet volume, risky ports, malformed packets, and scan-like behavior
- Filtering by IP, protocol, port, packet type, severity, and date range
- Search across packet IDs, IPs, protocols, and threat messages
- Log delete and export as CSV/JSON
- Responsive dark SOC dashboard UI

## API Structure

- `GET /api/health`
- `GET /api/packets`
- `GET /api/packets/:id`
- `DELETE /api/packets/:id`
- `GET /api/packets/export/:format`
- `GET /api/alerts`
- `PATCH /api/alerts/:id/acknowledge`
- `GET /api/analytics/dashboard`
- `POST /api/simulator/start`
- `POST /api/simulator/stop`

See [docs/API.md](docs/API.md) for request examples.

## Google Doc Notes

The shared Google Doc content has been converted to Markdown at [docs/GOOGLE_DOC_PROJECT_NOTES.md](docs/GOOGLE_DOC_PROJECT_NOTES.md).

## Security Notes

This project demonstrates secure API patterns suitable for an engineering portfolio:

- Request validation with Zod
- Rate limiting on all API routes
- Helmet security headers
- Input sanitization and query allowlisting
- MongoDB operator sanitization
- Controlled export formats
- Environment variables for secrets
- Pagination to protect large log queries

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Render/Railway/Vercel style deployment steps.
