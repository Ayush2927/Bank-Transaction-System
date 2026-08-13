import mongoose from "mongoose"

const virtualCardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Card must belong to a user"],
        index: true
    },

    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: [true, "Card must be listed to an account"]
    },

    cardNumber: {
        type: String,
        unique: true,
        length: 16,
        required: true
    },

    cardHolderName: {
        type: String,
        required: true,
        trim: true
    },
    expiryDate: {
        type: String,
        required: true
    },

    cvv: {
        type: String,
        required: true
    },
    isFrozen: {
        type: Boolean,
        default: false
    },
    monthlyLimit: {
        type: Number,
        default: 1000
    }
}, { timestamps: true })

const virtualCardModel = mongoose.model("virtualCardModel", virtualCardSchema)

export { virtualCardModel }