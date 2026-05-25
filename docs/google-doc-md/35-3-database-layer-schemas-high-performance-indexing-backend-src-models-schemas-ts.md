# 3. Database Layer Schemas & High-Performance Indexing (backend/src/models/Schemas.ts)

TypeScript
import { Schema, model, Document } from 'mongoose';


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


export interface IPacketDoc extends IPacket, Document {}
export interface IAlertDoc extends IAlert, Document {}


// Optimized with compounding indexes for lighting-fast analytical aggregations
const PacketSchema = new Schema<IPacketDoc>({
  timestamp: { type: Date, default: Date.now, index: true },
  sourceIp: { type: String, required: true, index: true },
  destIp: { type: String, required: true, index: true },
  protocol: { type: String, required: true, enum: ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'], index: true },
  sourcePort: { type: Number, required: true },
  destPort: { type: Number, required: true },
  packetSize: { type: Number, required: true },
  payloadSummary: { type: String }
});


const AlertSchema = new Schema<IAlertDoc>({
  timestamp: { type: Date, default: Date.now, index: true },
  type: { type: String, required: true },
  severity: { type: String, required: true, enum: ['Low', 'Medium', 'High', 'Critical'], index: true },
  sourceIp: { type: String, required: true },
  description: { type: String, required: true },
  resolved: { type: Boolean, default: false, index: true }
});


export const PacketModel = model<IPacketDoc>('Packet', PacketSchema);
export const AlertModel = model<IAlertDoc>('Alert', AlertSchema);


