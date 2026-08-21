import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getSpendingAnalytics } from "../controller/analytics.controller.js";

const analyticsRouter = express.Router();

analyticsRouter.get("/spending", authMiddleware, getSpendingAnalytics);

export { analyticsRouter };
