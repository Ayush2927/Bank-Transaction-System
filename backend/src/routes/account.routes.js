import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createAccount } from "../controller/account.controller.js";

const router=express.Router();


//POST api/accounts
//create a new account

router.post("/",authMiddleware,createAccount);



export default router ;