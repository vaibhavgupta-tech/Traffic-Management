import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import cors from "cors";
import { env } from "../config/env.js";

export const securityHeaders = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

export const corsPolicy = cors({
  origin: env.CLIENT_ORIGIN,
  credentials: true
});

export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  limit: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

export const sanitizeMongo = mongoSanitize({
  replaceWith: "_"
});

export function cleanQuery(req: Request, _res: Response, next: NextFunction) {
  for (const key of Object.keys(req.query)) {
    const value = req.query[key];
    if (typeof value === "string") {
      req.query[key] = value.replace(/[<>]/g, "").trim();
    }
  }
  next();
}
