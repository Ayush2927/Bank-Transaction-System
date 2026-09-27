import { scheduledTransferModel } from "../models/scheduledTransfer.model.js";
import { accountModel } from "../models/account.model.js";
import mongoose from "mongoose";

async function createScheduledTransfer(req, res) {
    try {
        const { fromAccount, toAccount, amount, executionDate, frequency } = req.body;

        if (!fromAccount || !toAccount || !amount || !executionDate) {
            return res.status(400).json({
                message: "fromAccount, toAccount, amount and executionDate are required"
            })
        };

        const sourceAccount = await accountModel.findOne({ _id: fromAccount, user: req.user._id });

        if (!sourceAccount) {
            return res.status(404).json({
                message: "Source account not found or unauthorized"
            })
        };

        const isObjectId = mongoose.Types.ObjectId.isValid(toAccount);
        const destAccount = await accountModel.findOne({
            $or: [
                ...(isObjectId ? [{ _id: toAccount }] : []),
                { accountNumber: toAccount }
            ]
        });

        if (!destAccount) {
            return res.status(404).json({
                message: "Destination account not found. Please enter a valid 10-digit Account Number or Account ID."
            })
        };

        if (sourceAccount._id.toString() === destAccount._id.toString()) {
            return res.status(400).json({
                message: "Source and destination accounts cannot be the same"
            });
        }

        const scheduled = await scheduledTransferModel.create({
            user: req.user._id,
            fromAccount: sourceAccount._id,
            toAccount: destAccount._id,
            amount: Number(amount),
            frequency: frequency || "MONTHLY",
            nextExecutionDate: new Date(executionDate),
            status: "ACTIVE"
        });

        return res.status(201).json({
            message: "Scheduled transfer created successfully",
            scheduled
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error creating transfer",
            error: error.message
        })
    }
}


async function getUserScheduledTransfers(req, res) {
    try {
        const scheduledTransfers = await scheduledTransferModel.find({ user: req.user._id })
            .populate({
                path: "fromAccount",
                select: "accountName accountNumber accountType"
            })
            .populate({
                path: "toAccount",
                select: "accountName accountNumber accountType",
                populate: { path: "user", select: "name email" }
            })
            .sort({ nextExecutionDate: 1 });

        return res.status(200).json({
            scheduledTransfers
        });


    } catch (error) {
        return res.status(500).json({
            message: "Error fetching scheduled transfers",
            error: error.message
        })
    }

}

async function cancelScheduledTransfers(req, res) {
    try {
        const { id } = req.params;

        const scheduled = await scheduledTransferModel.findOneAndUpdate({
            _id: id, user: req.user._id
        }, { status: "CANCELLED" }, { new: true });

        if (!scheduled) {
            return res.status(404).json({
                message: "Scheduled transfer not found or unauthorized"
            })
        };

        return res.status(200).json({
            message: "Scheduled transfer cancelled successfully",
            scheduled
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error cancelling this transfer",
            error: error.message
        })
    }
}

async function runDueTransfersNow(req, res) {
    try {
        const { executeDueTransfers } = await import("../services/cron.service.js");
        const result = await executeDueTransfers(req.user._id);

        return res.status(200).json({
            message: result.processed > 0
                ? `Successfully processed ${result.processed} due transfer(s)!`
                : "No scheduled transfers are currently due.",
            ...result
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error executing due transfers",
            error: error.message
        });
    }
}

export { createScheduledTransfer, getUserScheduledTransfers, cancelScheduledTransfers, runDueTransfersNow };