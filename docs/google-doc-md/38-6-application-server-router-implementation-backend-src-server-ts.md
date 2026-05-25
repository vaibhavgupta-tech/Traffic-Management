# 6. Application Server Router Implementation (backend/src/server.ts)

TypeScript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';


import { getDashboardStats, getFilteredLogs } from './controllers/metricsController';
import { startPacketEngine } from './services/packetEngine';


dotenv.config();


const app = express();
const httpServer = createServer(app);


// Rigorous Enterprise Security Layer Protections
app.use(helmet()); // Sets robust HTTP response protection headers
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());


// API Rate Limiting configuration to throttle high frequency scraping/DoS vectors
const secureLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 Minute window
  max: 150,
  message: { error: 'Security breach alert threshold met: Too many high frequency queries from this address node.' }
});
app.use('/api/', secureLimiter);


// System Endpoints
app.get('/api/analytics/overview', getDashboardStats);
app.get('/api/logs/query', getFilteredLogs);


// Duplex WebSocket Stream Configuration
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});


io.on('connection', (socket) => {
  console.log(`📡 Secure WS Channel Session Synchronized: ${socket.id}`);
});


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dpi-security';


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('📦 Core Security Database Connection Initialized.');
    httpServer.listen(PORT, () => {
      console.log(`🚀 SOC Controller core engine operating under proxy channel: ${PORT}`);
      startPacketEngine(io);
    });
  })
  .catch(err => console.error('[FATAL STARTUP EXCEPTION] Database Mapping Refused:', err));


