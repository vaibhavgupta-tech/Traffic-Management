import mongoose, { Schema } from "mongoose";

const packetSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    sourceIp: { type: String, required: true, index: true },
    destinationIp: { type: String, required: true, index: true },
    protocol: { type: String, required: true, index: true },
    port: { type: Number, required: true, index: true },
    size: { type: Number, required: true },
    timestamp: { type: Date, required: true, index: true },
    packetType: { type: String, required: true, index: true },
    action: { type: String, required: true },
    severity: { type: String, required: true, index: true },
    payloadSignature: { type: String, required: true },
    geo: { type: String },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

packetSchema.index({ sourceIp: "text", destinationIp: "text", protocol: "text", payloadSignature: "text" });

export const PacketModel = mongoose.model("Packet", packetSchema);
