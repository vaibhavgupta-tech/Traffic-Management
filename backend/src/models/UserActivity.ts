import mongoose, { Schema } from "mongoose";

const userActivitySchema = new Schema(
  {
    actor: { type: String, default: "system" },
    action: { type: String, required: true },
    ipAddress: { type: String },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const UserActivityModel = mongoose.model("UserActivity", userActivitySchema);
