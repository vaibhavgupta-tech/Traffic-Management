import { Router } from "express";
import { deletePacket, exportPackets, getPacket, listPackets, packetQuerySchema } from "../controllers/packetController.js";
import { validateQuery } from "../middleware/validate.js";

export const packetRouter = Router();

packetRouter.get("/", validateQuery(packetQuerySchema), listPackets);
packetRouter.get("/export/:format", exportPackets);
packetRouter.get("/:id", getPacket);
packetRouter.delete("/:id", deletePacket);
