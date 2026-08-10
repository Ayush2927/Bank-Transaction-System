import mongoose from "mongoose";

const vaultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Vault must belong to a user"],
        index: true
    },

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: [true, "Vault must be linked to an account"]
    },
    name: {
        type: String,
        required: [true, "Vault name is required"],
        trim: true
    },
    targetAmount: {
        type: Number,
        required: [true, "Target goal amount is required"],
        min: [1, "Target amount must be atleast 1Rs"]
    },

    currentAmount: {
        type: Number,
        default: 0,
        min: [0, "Current amount cannot be negative"]
    }
}, { timestamps: true });

const vaultModel = mongoose.model("vaultModel", vaultSchema);

export { vaultModel };