import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createCard, getUserVirtualCards, toggleFreezeCard, chargeCard } from "../controller/virtualCard.controller.js"

const virtualCardRouter = express.Router();

virtualCardRouter.post("/", authMiddleware, createCard);

virtualCardRouter.get("/", authMiddleware, getUserVirtualCards);

virtualCardRouter.patch("/:id/freeze", authMiddleware, toggleFreezeCard)

virtualCardRouter.post("/charge", chargeCard);


export { virtualCardRouter };