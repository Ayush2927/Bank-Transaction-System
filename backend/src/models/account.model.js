import mongoose from "mongoose"

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: [true, "Account must be associated with a user"],
        index:true
    },

    status: {
        type:String,
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can either be ACTIVE,FROZEN or CLOSED",
        default:"ACTIVE"

    },

    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"

    }


}, { timestamps: true })

accountSchema.index({user:1,status:1})

const accountModel = mongoose.model("accountModel", accountSchema)

export { accountModel }