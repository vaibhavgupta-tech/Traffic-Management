# server\src\models\ThreatAlert.ts



``ts
import mongoose, { InferSchemaType } from "mongoose";


const threatAlertSchema = new mongoose.Schema(
  {
    severity: { type: String, enum: ["low", "medium", "high", "critical"], required: true, index: true },
    type: { type: String, required: true, index: true },
    sourceIp: { type: String, required: true, index: true },
    description: { type: String, required: true },
    packetId: { type: mongoose.Schema.Types.ObjectId, ref: "Packet" },
    status: { type: String, enum: ["open", "investigating", "resolved"], default: "open", index: true },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);


export type ThreatAlertDocument = InferSchemaType<typeof threatAlertSchema>;
export const ThreatAlert = mongoose.model("ThreatAlert", threatAlertSchema);


server\src\models\UserActivity.ts
``ts
import mongoose from "mongoose";
const userActivitySchema = new mongoose.Schema(
{
actor: { type: String, default: "system", index: true },
action: { type: String, required: true },
ipAddress: { type: String, default: "" },
metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
},
{ timestamps: true }
);
export const UserActivity = mongoose.model("UserActivity", userActivitySchema);


