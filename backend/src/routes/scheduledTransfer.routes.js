import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createScheduledTransfer, getUserScheduledTransfers, cancelScheduledTransfers } from "../controller/scheduledTransferController.js";

const scheduledRouter = express.Router();

scheduledRouter.post("/", authMiddleware, createScheduledTransfer);
scheduledRouter.get("/", authMiddleware, getUserScheduledTransfers);
scheduledRouter.delete("/:id", authMiddleware, cancelScheduledTransfers);

export { scheduledRouter };
