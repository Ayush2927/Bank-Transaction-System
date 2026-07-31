import express from "express"
import { userRegister, userLogin } from "../controller/auth.controller.js";
import { userLogout } from "../controller/auth.controller.js";
const router = express.Router();

//Post /api/auth/register
router.post("/register", userRegister)

//Post api/auth/login
router.post("/login", userLogin)

//auth/logout

router.post("/logout", userLogout)

export default router