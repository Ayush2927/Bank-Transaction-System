import express from "express"
import { userRegister, userLogin } from "../controller/auth.controller.js";
import { userLogout } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();

//Post /api/auth/register
router.post("/register", authLimiter, userRegister)

//Post api/auth/login
router.post("/login", authLimiter, userLogin)

//auth/logout

router.post("/logout", userLogout)

export default router