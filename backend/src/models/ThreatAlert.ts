import mongoose, { Schema } from "mongoose";

const threatAlertSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    packetId: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    severity: { type: String, required: true, index: true },
    sourceIp: { type: String, index: true },
    destinationIp: { type: String },
    category: { type: String, required: true, index: true },
    acknowledged: { type: Boolean, default: false, index: true },
    createdAt: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export const ThreatAlertModel = mongoose.model("ThreatAlert", threatAlertSchema);
