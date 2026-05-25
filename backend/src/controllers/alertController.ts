import type { Request, Response } from "express";
import mongoose from "mongoose";
import { ThreatAlertModel } from "../models/ThreatAlert.js";
import { memoryStore } from "../services/memoryStore.js";

export async function listAlerts(req: Request, res: Response) {
  const limit = Math.min(Number(req.query.limit ?? 50), 100);
  if (mongoose.connection.readyState !== 1) {
    return res.json({ data: memoryStore.listAlerts(limit) });
  }
  const rows = await ThreatAlertModel.find().sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ data: rows.map((row) => ({ ...row, id: row.id ?? String(row._id), createdAt: new Date(row.createdAt).toISOString() })) });
}

export async function acknowledgeAlert(req: Request, res: Response) {
  const { id } = req.params;
  if (mongoose.connection.readyState !== 1) {
    const alert = memoryStore.acknowledgeAlert(id);
    return alert ? res.json(alert) : res.status(404).json({ message: "Alert not found" });
  }
  const identifiers: Record<string, string>[] = [{ id }];
  if (mongoose.isValidObjectId(id)) identifiers.push({ _id: id });
  const alert = await ThreatAlertModel.findOneAndUpdate(
    { $or: identifiers },
    { acknowledged: true },
    { new: true }
  ).lean();
  return alert ? res.json({ ...alert, id: alert.id ?? String(alert._id) }) : res.status(404).json({ message: "Alert not found" });
}
