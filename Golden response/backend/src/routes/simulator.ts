import { Router } from "express";
import type { Server } from "socket.io";
import { startSimulator, stopSimulator } from "../services/simulator.js";

export function createSimulatorRouter(io: Server) {
  const router = Router();
  router.post("/start", (_req, res) => {
    startSimulator(io);
    res.json({ status: "running" });
  });
  router.post("/stop", (_req, res) => {
    stopSimulator();
    res.json({ status: "stopped" });
  });
  return router;
}
