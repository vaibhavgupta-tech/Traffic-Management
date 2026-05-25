# 5. Application Server Configuration (backend/src/server.ts)

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


// Global Security Settings
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());


// API Rate Limiting to counter brute-force scraping
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { error: 'Too many compliance requests from this endpoint.' }
});
app.use('/api/', apiLimiter);


// System Endpoint Directives
app.get('/api/analytics/overview', getDashboardStats);
app.get('/api/logs/query', getFilteredLogs);


// Real-time Event Subscriptions
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});


io.on('connection', (socket) => {
  console.log(`📡 Analyst terminal session activated: ${socket.id}`);
});


const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dpi-security';


mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('📦 Connected to Secure Datastore Node');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Security Control Server active on port ${PORT}`);
      startPacketEngine(io);
    });
  })
  .catch(err => console.error('Database configuration mapping failed:', err));


💻 Frontend Implementation
