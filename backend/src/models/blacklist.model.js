import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is needed for it to be blacklisted"],
        unique: [true, "Token is already blacklisted"]
    }
}, { timestamps: true })

blacklistSchema.index({ createdAt: 1 },
    { expireAfterSeconds: 60 * 60 * 24 * 3 }// 3 days
)


const tokenBlacklistModel = mongoose.model("tokenBlacklistModel", blacklistSchema);

export { tokenBlacklistModel }