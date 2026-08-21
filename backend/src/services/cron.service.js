import { scheduledTransferModel } from "../models/scheduledTransfer.model.js";
import { transactionModel } from "../models/transaction.model.js";
import { accountModel } from "../models/account.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import cron from "node-cron";
import mongoose from "mongoose";


function calculateNextDate(currentDate, frequency) {
    const next = new Date(currentDate);
    if (frequency === "DAILY") {
        next.setDate(next.getDate() + 1);
    }
    if (frequency === "WEEKLY") {
        next.setDate(next.getDate() + 7);
    }
    if (frequency === "MONTHLY") {
        next.setMonth(next.getMonth() + 1);
    }

    return next;
}


function initCron() {

    cron.schedule("0 0 * * *", async () => {
        console.log("Running scheduled Transfers Background Worker");

        try {

            const now = new Date();

            const dueTransfers = await scheduledTransferModel.find({
                status: "ACTIVE",
                nextExecutionDate: { $lte: now }
            });

            for (const item of dueTransfers) {
                const session = await mongoose.startSession();
                try {
                    session.startTransaction();

                    const fromAcc = await accountModel.findById(item.fromAccount);
                    const balance = await fromAcc.getBalance(session);

                    if (balance < item.amount) {
                        console.log(`Scheduled transfer ${item._id} skipped: Insufficient balance`);
                        await session.abortTransaction();
                        session.endSession();
                        continue;
                    }

                    const idempotencyKey = `cron_${item._id}_${Date.now()}`;

                    const [transaction] = await transactionModel.create([{
                        fromAccount: item.fromAccount,
                        toAccount: item.toAccount,
                        amount: item.amount,
                        idempotencyKey,
                        status: "COMPLETE"
                    }], { session });

                    await ledgerModel.create([{
                        account: item.fromAccount,
                        amount: item.amount,
                        transaction: transaction._id,
                        type: "DEBIT"
                    }], { session });
                    await ledgerModel.create([{
                        account: item.toAccount,
                        amount: item.amount,
                        transaction: transaction._id,
                        type: "CREDIT"
                    }], { session });
                    await session.commitTransaction();
                    session.endSession();

                    if (item.frequency === "ONCE") {
                        item.status = "COMPLETED";
                    } else {
                        item.nextExecutionDate = calculateNextDate(item.nextExecutionDate, item.frequency);
                    }
                    await item.save();
                    console.log(`Processed recurring transfer ${item._id} for $${item.amount}`);


                } catch (error) {
                    await session.abortTransaction();
                    session.endSession();
                    console.error(`Error executing cron transfer ${item._id}:`, error.message);
                }
            }

        } catch (error) {
            console.error("Cron worker error:", error.message);
        }
    })
}

export { initCron }