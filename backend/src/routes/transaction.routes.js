import express from "express";
import authorizationMiddleware from "../middleware/auth.middleware";

const transactionRouter=express.Router();

transactionRouter.post("/",authorizationMiddleware)


export {transactionRouter}