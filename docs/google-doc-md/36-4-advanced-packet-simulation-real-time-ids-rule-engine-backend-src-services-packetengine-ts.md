# 4. Advanced Packet Simulation & Real-time IDS Rule Engine (backend/src/services/packetEngine.ts)

TypeScript
import { Server } from 'socket.io';
import { PacketModel, AlertModel } from '../models/Schemas';


const PROTOCOLS = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'] as const;
const SUSPICIOUS_IPS = ['192.168.1.105', '10.0.0.66', '45.33.22.11', '185.220.101.5'];
const RECENT_TRAFFIC: { [key: string]: number[] } = {};


export function startPacketEngine(io: Server) {
  // Infinite sliding network traffic pipeline
  setInterval(async () => {
    try {
      // Step A: Emulate Dynamic Packet Structs
      const isSuspicious = Math.random() < 0.12;
      const srcIp = isSuspicious
        ? SUSPICIOUS_IPS[Math.floor(Math.random() * SUSPICIOUS_IPS.length)]
        : `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
        
      const destIp = `10.0.0.${Math.floor(Math.random() * 254) + 1}`;
      const protocol = PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)];
      const destPort = [22, 53, 80, 443, 8080, 27017][Math.floor(Math.random() * 6)];
      const packetSize = Math.floor(Math.random() * 1450) + 64;


      const rawPacket = {
        timestamp: new Date(),
        sourceIp: srcIp,
        destIp,
        protocol,
        sourcePort: Math.floor(Math.random() * 63000) + 2000,
        destPort,
        packetSize,
        payloadSummary: protocol === 'HTTP' ? 'GET /api/v1/auth HTTP/1.1' : 'Encrypted Cryptographic TLS Fragment'
      };


      // Asynchronous non-blocking persistence
      const savedPacket = await PacketModel.create(rawPacket);
      
      // Dispatch immediately down WebSockets Pipeline
      io.emit('new-packet', savedPacket);


      // Step B: Run Stateful Deep Packet Inspection Rules (IDS)
      await runSignatureInspection(savedPacket, io);


    } catch (err) {
      console.error('[CRITICAL ENGINE ERROR] Processing disrupted:', err);
    }
  }, 750); // Velocity throughput metric ~1.33 packets per second
}


async function runSignatureInspection(packet: any, io: Server) {
  const now = Date.now();
  
  // Rule ID 001: Threat Intel Blacklisted Ingress Source Match
  if (SUSPICIOUS_IPS.includes(packet.sourceIp)) {
    const alert = await AlertModel.create({
      timestamp: new Date(),
      type: 'Suspicious IP',
      severity: 'Critical',
      sourceIp: packet.sourceIp,
      description: `Inbound vector intercepted from zero-trust blacklisted host node: ${packet.sourceIp}`
    });
    io.emit('new-alert', alert);
  }


  // Rule ID 002: Volumetric DDoS/Flooding Countermeasure Threshold Verification
  if (!RECENT_TRAFFIC[packet.sourceIp]) RECENT_TRAFFIC[packet.sourceIp] = [];
  RECENT_TRAFFIC[packet.sourceIp].push(now);
  
  // Evict outdated packet histories older than 5000ms
  RECENT_TRAFFIC[packet.sourceIp] = RECENT_TRAFFIC[packet.sourceIp].filter(t => now - t < 5000);


  // If packet velocity frequency bursts beyond 12 queries within a 5 second sliding window
  if (RECENT_TRAFFIC[packet.sourceIp].length > 12) {
    const alert = await AlertModel.create({
      timestamp: new Date(),
      type: 'High Traffic Volume',
      severity: 'High',
      sourceIp: packet.sourceIp,
      description: `Potential Layer-4 Volumetric Flooding. Host generated ${RECENT_TRAFFIC[packet.sourceIp].length} network fragments in <5000ms.`
    });
    io.emit('new-alert', alert);
    
    // Clear state buffer array to prevent excessive alert cascading
    RECENT_TRAFFIC[packet.sourceIp] = [];
  }
}


