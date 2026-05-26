import { Router } from "express";
import { dashboardAnalytics } from "../controllers/analyticsController.js";

export const analyticsRouter = Router();

analyticsRouter.get("/dashboard", dashboardAnalytics);
