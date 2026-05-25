# server\src\routes\alerts.ts



``ts
import { Router } from "express";
import Joi from "joi";
import { getAlerts, updateAlert } from "../controllers/packetController.js";
import { validateBody } from "../middleware/validate.js";


export const alertRouter = Router();


alertRouter.get("/", getAlerts);
alertRouter.patch("/:id", validateBody(Joi.object({ status: Joi.string().valid("open", "investigating", "resolved").required() })), updateAlert);


server\src\routes\packets.ts
``ts
import { Router } from "express";
import { createPacket, deletePackets, exportPackets, getDashboard, getPackets } from "../controllers/packetController.js";
import { validateBody, validateQuery } from "../middleware/validate.js";
import { exportPacketQuerySchema, packetBodySchema, packetQuerySchema } from "../utils/query.js";
export const packetRouter = Router();
packetRouter.get("/", validateQuery(packetQuerySchema), getPackets);
packetRouter.post("/", validateBody(packetBodySchema), createPacket);
packetRouter.delete("/", validateQuery(packetQuerySchema), deletePackets);
packetRouter.get("/export", validateQuery(exportPacketQuerySchema), exportPackets);
packetRouter.get("/analytics/dashboard", getDashboard);


