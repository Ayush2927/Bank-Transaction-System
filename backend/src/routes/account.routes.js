import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createAccount, getUserAccounts, getAccountBalance } from "../controller/account.controller.js";

const router = express.Router();


//POST api/accounts/
//create a new account

router.post("/", authMiddleware, createAccount);

// api/accounts/user_accounts

router.get("/user_accounts", authMiddleware, getUserAccounts)

// fetch balance 

router.get("/balance/:accountId", authMiddleware, getAccountBalance)



export default router;