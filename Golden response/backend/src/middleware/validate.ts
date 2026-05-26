import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid query parameters", issues: parsed.error.flatten() });
    }
    req.query = parsed.data;
    next();
  };
}
