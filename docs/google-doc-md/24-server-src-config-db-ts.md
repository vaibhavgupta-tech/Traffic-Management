# server\src\config\db.ts



``ts
import mongoose from "mongoose";
import { env } from "./env.js";


export async function connectDatabase() {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log(`MongoDB connected: ${mongoose.connection.name}`);
}


server\src\config\env.ts
``ts
import dotenv from "dotenv";
dotenv.config();
export const env = {
nodeEnv: process.env.NODE_ENV ?? "development",
port: Number(process.env.PORT ?? 8080),
mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/dpi_soc_monitor",
clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
jwtSecret: process.env.JWT_SECRET ?? "dev-only-change-me",
simulatePackets: process.env.SIMULATE_PACKETS !== "false",
rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60000),
rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 180)
};


