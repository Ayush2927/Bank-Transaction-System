import mongoose from "mongoose"

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Contact must belong to a user"],
        index: true
    },

    name: {
        type: String,
        required: [true, "Contact name is required"],
        trim: true
    },

    targetAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountModel",
        required: [true, "Target account ID is required"]
    },

    nickname: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true })

contactSchema.index({ user: 1, targetAccount: 1 }, { unique: true });

const contactModel = mongoose.model("contactModel", contactSchema);

export { contactModel }