import mongoose from "mongoose"
import { ledgerModel } from "./ledger.model.js"

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: [true, "Account must be associated with a user"],
        index: true
    },

    status: {
        type: String,
        enum: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can either be ACTIVE,FROZEN or CLOSED",
        default: "ACTIVE"

    },

    currency: {
        type: String,
        required: [true, "Currency is required for creating an account"],
        default: "INR"

    }


}, { timestamps: true })

accountSchema.index({ user: 1, status: 1 })

accountSchema.methods.getBalance = async function (session = null) {

    const options = session ? { session } : {};

    const balanceData = await ledgerModel.aggregate([
        { $match: { account: this._id } },
        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "DEBIT"] },
                            "$amount",
                            0
                        ]
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            0
                        ]
                    }
                }
            }
        },

        {
            $project: {
                _id: 0,
                balance: { $subtract: ["$totalCredit", "$totalDebit"] }
            }
        }
    ], options)

    if (balanceData.length === 0) {
        return 0;
    }

    return balanceData[0].balance;
}

const accountModel = mongoose.model("accountModel", accountSchema)

export { accountModel }