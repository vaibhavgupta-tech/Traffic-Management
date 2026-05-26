import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:5173"),
  MONGODB_URI: z.string().optional().default(""),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().default(240),
  SIMULATOR_ENABLED: z.coerce.boolean().default(true),
  SIMULATOR_INTERVAL_MS: z.coerce.number().default(1100)
});

export const env = envSchema.parse(process.env);
