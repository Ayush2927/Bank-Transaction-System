import mongoose from "mongoose"

const scheduledTransferSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Scheduled transfer must belong to a user"],
        index: true
    },

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: [true, "Source account is required"]
    },

    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: [true, "Destination account is required"]
    },

    amount: {
        type: Number,
        required: true,
        min: [1, "Amount must at least be 1"]
    },

    frequency: {
        type: String,
        enum: ["ONCE", "DAILY", "MONTHLY", "WEEKLY"],
        required: true,
        default: "MONTHLY"
    },

    nextExecutionDate: {
        type: Date,
        required: true,
        index: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"],
        default: "ACTIVE"
    }
}, { timestamps: true });

const scheduledTransferModel = mongoose.model("scheduledTransferModel", scheduledTransferSchema);

export { scheduledTransferModel };