import express from "express";
import { authMiddleware, authSystemUserMiddleware } from "../middleware/auth.middleware.js";
import { createTransaction, createInitialFundsTransaction, getTransactionHistory } from "../controller/transaction.controller.js";
import { transactionLimiter } from "../middleware/rateLimiter.js";
const transactionRouter = express.Router();

transactionRouter.post("/", authMiddleware, transactionLimiter, createTransaction)

transactionRouter.post("/system/initial-funds", authSystemUserMiddleware, transactionLimiter, createInitialFundsTransaction)

transactionRouter.get("/history", authMiddleware, transactionLimiter, getTransactionHistory)


export { transactionRouter } 