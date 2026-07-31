import express from "express";
import { authMiddleware, authSystemUserMiddleware } from "../middleware/auth.middleware.js";
import { createTransaction, createInitialFundsTransaction } from "../controller/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.post("/", authMiddleware, createTransaction)

transactionRouter.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction)


export { transactionRouter } 