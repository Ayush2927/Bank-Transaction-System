import express from "express"
import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import { transactionRouter } from "./routes/transaction.routes.js";
import cookie_parser from "cookie-parser"
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json())
app.use(cookie_parser())


//Usage of routes
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter)

export { app };