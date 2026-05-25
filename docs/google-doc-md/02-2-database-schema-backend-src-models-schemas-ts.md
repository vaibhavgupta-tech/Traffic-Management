# 2. Database Schema (backend/src/models/Schemas.ts)

TypeScript
import { Schema, model } from 'mongoose';


export interface IPacket {
  timestamp: Date;
  sourceIp: string;
  destIp: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTP' | 'HTTPS';
  sourcePort: number;
  destPort: number;
  packetSize: number;
  payloadSummary?: string;
}


export interface IAlert {
  timestamp: Date;
  type: 'Port Scan' | 'DDoS Attack' | 'Suspicious IP' | 'High Traffic Volume';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  sourceIp: string;
  description: string;
  resolved: boolean;
}


const PacketSchema = new Schema<IPacket>({
  timestamp: { type: Date, default: Date.now, index: true },
  sourceIp: { type: String, required: true, index: true },
  destIp: { type: String, required: true, index: true },
  protocol: { type: String, required: true, enum: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'] },
  sourcePort: { type: Number, required: true },
  destPort: { type: Number, required: true },
  packetSize: { type: Number, required: true },
  payloadSummary: { type: String }
});


const AlertSchema = new Schema<IAlert>({
  timestamp: { type: Date, default: Date.now, index: true },
  type: { type: String, required: true },
  severity: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'] },
  sourceIp: { type: String, required: true },
  description: { type: String, required: true },
  resolved: { type: Boolean, default: false }
});


export const PacketModel = model<IPacket>('Packet', PacketSchema);
export const AlertModel = model<IAlert>('Alert', AlertSchema);


