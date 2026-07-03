import express from "express"
import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import cookie_parser from "cookie-parser"
const app=express();


app.use(express.json())
app.use(cookie_parser())


//Usage of routes
app.use("/api/auth", authRouter)
app.use("/api/accounts",accountRouter);


export {app};