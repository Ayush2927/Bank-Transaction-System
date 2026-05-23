import express from "express"
import authRouter from "./routes/auth.routes.js";
import cookie_parser from "cookie-parser"
const app=express();


app.use(express.json())
app.use(cookie_parser())

app.use("/api/auth", authRouter)

export {app};