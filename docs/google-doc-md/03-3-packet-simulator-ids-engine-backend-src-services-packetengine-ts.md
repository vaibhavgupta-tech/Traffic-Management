# 3. Packet Simulator & IDS Engine (backend/src/services/packetEngine.ts)

TypeScript
import { Server } from 'socket.io';
import { PacketModel, AlertModel } from '../models/Schemas';


const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'] as const;
const SUSPICIOUS_IPS = ['192.168.1.105', '10.0.0.66', '45.33.22.11'];
const RECENT_TRAFFIC: { [key: string]: number[] } = {};


export function startPacketEngine(io: Server) {
  setInterval(async () => {
    // 1. Generate Simulated Packet
    const srcIp = Math.random() > 0.15 
      ? `192.168.1.${Math.floor(Math.random() * 254) + 1}`
      : SUSPICIOUS_IPS[Math.floor(Math.random() * SUSPICIOUS_IPS.length)];
      
    const destIp = `10.0.0.${Math.floor(Math.random() * 254) + 1}`;
    const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
    const destPort = [80, 443, 22, 53, 8080][Math.floor(Math.random() * 5)];
    const packetSize = Math.floor(Math.random() * 1450) + 64;


    const rawPacket = {
      timestamp: new Date(),
      sourceIp: srcIp,
      destIp,
      protocol,
      sourcePort: Math.floor(Math.random() * 63000) + 2000,
      destPort,
      packetSize,
      payloadSummary: protocol === 'HTTP' ? 'GET /api/v1/auth HTTP/1.1' : 'Encrypted TLS Layer'
    };


    // Save asynchronously to prevent processing blocking
    const savedPacket = await PacketModel.create(rawPacket);
    io.emit('new-packet', savedPacket);


    // 2. Simple Intrusion Detection Rules (IDS Engine)
    await runIDS(savedPacket, io);


  }, 800); // Emits packet every 800ms
}


async function runIDS(packet: any, io: Server) {
  const now = Date.now();
  
  // Rule A: Suspicious External IP Hit
  if (SUSPICIOUS_IPS.includes(packet.sourceIp)) {
    const alert = await AlertModel.create({
      timestamp: new Date(),
      type: 'Suspicious IP',
      severity: 'High',
      sourceIp: packet.sourceIp,
      description: `Traffic detected from known malicious endpoint: ${packet.sourceIp}`
    });
    io.emit('new-alert', alert);
  }


  // Rule B: Horizontal Rate Detection (Volumetric/DDoS/Port Scan)
  if (!RECENT_TRAFFIC[packet.sourceIp]) RECENT_TRAFFIC[packet.sourceIp] = [];
  RECENT_TRAFFIC[packet.sourceIp].push(now);
  
  // Clean up old timestamps (> 5 seconds old)
  RECENT_TRAFFIC[packet.sourceIp] = RECENT_TRAFFIC[packet.sourceIp].filter(t => now - t < 5000);


  if (RECENT_TRAFFIC[packet.sourceIp].length > 15) {
    const alert = await AlertModel.create({
      timestamp: new Date(),
      type: 'High Traffic Volume',
      severity: 'Medium',
      sourceIp: packet.sourceIp,
      description: `Host exceeded normal throughput limits with ${RECENT_TRAFFIC[packet.sourceIp].length} bursts within 5s.`
    });
    io.emit('new-alert', alert);
    // Reset window counters to throttle alerts
    RECENT_TRAFFIC[packet.sourceIp] = [];
  }
}


