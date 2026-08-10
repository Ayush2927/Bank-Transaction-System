import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createVault, getUserVaults, depositToVault, withdrawFromVault } from "../controller/vault.controller.js";

const vaultRouter = express.Router();

// /api/vaults/ 
vaultRouter.post("/", authMiddleware, createVault);

// /api/vaults/get
vaultRouter.get("/", authMiddleware, getUserVaults);

// /api/vaults/:id/deposit
vaultRouter.post("/:id/deposit", authMiddleware, depositToVault);

// /api/vaults/:id/withdraw
vaultRouter.post("/:id/withdraw", authMiddleware, withdrawFromVault);

export { vaultRouter };