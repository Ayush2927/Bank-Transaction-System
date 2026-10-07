import rateLimit from "express-rate-limit"

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    limit: 5, // max 5 reqs per ip
    skip: () => process.env.NODE_ENV === "test",
    message: {
        message: "Too many login/registration attempts from this IP. Please try again after 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false
});


const transactionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    skip: () => process.env.NODE_ENV === "test",
    message: {
        message: "Transfer rate limit exceeded. You can only make 20 transfers every 15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false
});

const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    skip: () => process.env.NODE_ENV === "test",
    message: {
        message: "Too many requests sent from this IP. Please slow down"
    },
    standardHeaders: true,
    legacyHeaders: false
});

export { authLimiter, transactionLimiter, globalLimiter };
