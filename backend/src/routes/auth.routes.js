import express from "express"
import { userRegister, userLogin, userLogout, sendOTP, verifyOTP, toggle2FA } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Post /api/auth/register
router.post("/register", authLimiter, userRegister);

// Post /api/auth/login
router.post("/login", authLimiter, userLogin);

// Post /api/auth/logout
router.post("/logout", userLogout);

// 🔐 2FA Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/toggle-2fa", authMiddleware, toggle2FA);

export default router;