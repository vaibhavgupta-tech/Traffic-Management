import { Router } from "express";
import { acknowledgeAlert, listAlerts } from "../controllers/alertController.js";

export const alertRouter = Router();

alertRouter.get("/", listAlerts);
alertRouter.patch("/:id/acknowledge", acknowledgeAlert);
