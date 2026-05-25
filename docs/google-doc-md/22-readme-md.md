# README.md

``md
DPI Sentinel - Deep Packet Inspection SOC Dashboard
A professional full-stack Deep Packet Inspection web application for real-time packet monitoring, threat detection, analytics, filtering, secure log management, and portfolio-ready cybersecurity demos.
Tech Stack
* Frontend: React, TypeScript, Tailwind CSS, Recharts, Socket.io Client
* Backend: Node.js, Express, TypeScript, Socket.io
* Database: MongoDB with Mongoose schemas
* Security: Helmet, CORS, HPP protection, rate limiting, Joi validation, XSS sanitization
Folder Structure
dpi-soc-monitor/
  client/
    src/components/      # Sidebar, filters, charts, tables, alerts
    src/hooks/           # Real-time packet data hook
    src/lib/             # API client
    src/pages/           # Dashboard page
    src/types/           # Shared frontend types
  server/
    src/config/          # Environment and database connection
    src/controllers/     # REST API handlers
    src/middleware/      # Security and validation middleware
    src/models/          # Packet, alert, activity, analytics schemas
    src/routes/          # API route definitions
    src/services/        # Threat detection and packet simulation
    src/utils/           # Query builders and schemas
API Structure
GET    /health
GET    /api/packets
POST   /api/packets
DELETE /api/packets
GET    /api/packets/export?format=csv|json
GET    /api/packets/analytics/dashboard
GET    /api/alerts
PATCH  /api/alerts/:id
WS     packet:new, alert:new
Database Schema
Packet logs store source IP, destination IP, protocol, port, packet size, packet type, payload preview, and timestamp.
Threat alerts store severity, alert type, source IP, description, linked packet ID, status, and timestamp.
User activity stores actor, action, IP address, and metadata.
Analytics snapshots store metric name, numeric value, labels, and capture time for historical reporting.
Setup
1. Install dependencies:
npm run install:all
2. Create environment files:
cp server/.env.example server/.env
cp client/.env.example client/.env
3. Start MongoDB locally or set MONGODB_URI to MongoDB Atlas.
4. Run both apps:
npm run dev
5. Open:
http://localhost:5173
Environment Variables
Server:
NODE_ENV=development
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/dpi_soc_monitor
CLIENT_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
SIMULATE_PACKETS=true
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=180
Client:
VITE_API_URL=http://localhost:8080
Security Features
* Input sanitization against XSS payloads
* Joi request validation for packet filters and exports
* Rate limiting across API routes
* Helmet security headers
* HPP protection against query parameter pollution
* Environment-based secrets and database credentials
* Mongo queries built from allow-listed validated fields
Deployment
* Backend: deploy server to Render, Railway, Fly.io, or a VPS.
* Frontend: deploy client to Vercel, Netlify, or static hosting.
* Database: use MongoDB Atlas in production.
* Set CLIENT_ORIGIN to the deployed frontend URL.
* Set VITE_API_URL to the deployed backend URL.
* Disable simulated data with SIMULATE_PACKETS=false when integrating real packet capture.
Real Packet Capture Integration
The included simulator emits realistic metadata for safe demos. For real DPI ingestion, run a privileged packet-capture service separately, parse packets with tools such as Zeek, Suricata, Scapy, or tshark, and POST sanitized metadata into the same packet schema. Avoid storing raw payloads unless you have explicit legal authorization and a retention policy.


