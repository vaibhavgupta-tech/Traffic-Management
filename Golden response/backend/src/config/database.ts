import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.MONGODB_URI) {
    console.log("MongoDB URI not provided. Using in-memory demo store.");
    return false;
  }

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production"
  });

  console.log("MongoDB connected.");
  return true;
}
