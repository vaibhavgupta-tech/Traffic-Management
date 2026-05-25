# server\src\models\AnalyticsSnapshot.ts



``ts
import mongoose from "mongoose";


const analyticsSnapshotSchema = new mongoose.Schema(
  {
    metric: { type: String, required: true, index: true },
    value: { type: Number, required: true },
    labels: { type: mongoose.Schema.Types.Mixed, default: {} },
    capturedAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);


export const AnalyticsSnapshot = mongoose.model("AnalyticsSnapshot", analyticsSnapshotSchema);


server\src\models\Packet.ts
``ts
import mongoose, { InferSchemaType } from "mongoose";
const packetSchema = new mongoose.Schema(
{
sourceIp: { type: String, required: true, index: true },
destinationIp: { type: String, required: true, index: true },
protocol: { type: String, required: true, enum: ["TCP", "UDP", "ICMP", "HTTP", "HTTPS", "DNS", "SSH", "FTP", "OTHER"], index: true },
port: { type: Number, required: true, min: 0, max: 65535, index: true },
size: { type: Number, required: true, min: 0 },
packetType: { type: String, required: true, enum: ["inbound", "outbound", "internal"], index: true },
payloadPreview: { type: String, default: "" },
timestamp: { type: Date, default: Date.now, index: true }
},
{ timestamps: true }
);
packetSchema.index({ sourceIp: "text", destinationIp: "text", protocol: "text" });
export type PacketDocument = InferSchemaType<typeof packetSchema>;
export const Packet = mongoose.model("Packet", packetSchema);


