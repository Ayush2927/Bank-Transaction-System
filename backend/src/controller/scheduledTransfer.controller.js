import { scheduledTransferModel } from "../models/scheduledTransfer.model.js";
import { accountModel } from "../models/account.model.js";

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

        const destAccount = await accountModel.findOne({ _id: toAccount });

        if (!destAccount) {
            return res.status(404).json({
                message: "Destination account not found"
            })
        };

        const scheduled = await scheduledTransferModel.create({
            user: req.user._id,
            fromAccount,
            toAccount,
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
            .populate("fromAccount")
            .populate("toAccount")
            .sort({ nextExecutionDate: 1 })

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

export { createScheduledTransfer, getUserScheduledTransfers, cancelScheduledTransfers }