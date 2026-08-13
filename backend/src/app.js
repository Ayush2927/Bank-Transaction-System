import express from "express"
import authRouter from "./routes/auth.routes.js";
import accountRouter from "./routes/account.routes.js";
import { transactionRouter } from "./routes/transaction.routes.js";
import cookie_parser from "cookie-parser"
import cors from "cors";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { contactRouter } from "./routes/contact.routes.js";
import { vaultRouter } from "./routes/vault.routes.js";
import { virtualCardRouter } from "./routes/virtualCard.routes.js";
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json())
app.use(cookie_parser())
app.use(globalLimiter)


//Usage of routes
app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter);
app.use("/api/transactions", transactionRouter)
app.use("/api/contacts", contactRouter)
app.use("/api/vaults", vaultRouter)
app.use("/api/cards", virtualCardRouter)
export { app };