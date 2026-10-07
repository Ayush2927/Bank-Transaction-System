import { ledgerModel } from "../models/ledger.model.js";
import { transactionModel } from "../models/transaction.model.js";
import { accountModel } from "../models/account.model.js";
import { sendRegistrationMail, sendtransactionMail, sendtransactionFailureMail } from "../services/email.service.js";
import mongoose from "mongoose";

/**
 * -Create a new transaction
 * The 10 step transfer flow:
 * 1.Validate request
 * 2.Validate idempotency key
 * 3.Check account status
 * 4.Derive sender balance from ledger
 * 5.Create transaction(PENDING)
 * 6.Create DEBIT ledger entry
 * 7.Create CREDIT ledger entry
 * 8.Mark transaction completed
 * 9.Commit MongoDb session
 * 10.Send email notification
 */


async function createTransaction(req, res) {

    /**
     * 1.Validate request
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "fromAccount,toAccount,amount and idempotencyKey are required "
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id: fromAccount
    })

    const isToObjectId = mongoose.Types.ObjectId.isValid(toAccount);
    const toUserAccount = await accountModel.findOne({
        $or: [
            ...(isToObjectId ? [{ _id: toAccount }] : []),
            { accountNumber: toAccount }
        ]
    });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(400).json({
            message: "Invalid fromAccount or toAccount. Check destination account number."
        })
    }

    /**
     * Validate idempotency key so that the transaction does not repeat itself
     * 
     */

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if (isTransactionAlreadyExists) {
        if (isTransactionAlreadyExists.status === "COMPLETE") {
            return res.status(200).json({
                message: "Transaction already processed successfully",
                transaction: isTransactionAlreadyExists
            })
        }

        if (isTransactionAlreadyExists.status === "PENDING") {
            return res.status(409).json({
                message: "Transaction with this idempotency key is currently being processed. Please wait"
            })
        }

        if (isTransactionAlreadyExists.status === "FAILED" || isTransactionAlreadyExists.status === "REVERSED") {
            return res.status(500).json({
                message: `Transaction previously ${isTransactionAlreadyExists.status.toLowerCase()}. Please use a new idempotency key to retry`
            })
        }



    }

    /**
     * 3.Check account status
     */

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
        return res.status(400).json({
            message: "Both fromAccount and toAccount must be ACTIVE"
        })
    }







    /**
     * 5.Create transaction(PENDING)
     */

    let transaction;
    const session = await mongoose.startSession();
    try {


        session.startTransaction();

        // 1. Acquire document-level write lock on source account to serialize concurrent transfers (prevent double-spend)
        await accountModel.findOneAndUpdate(
            { _id: fromUserAccount._id },
            { $inc: { __v: 1 } },
            { session }
        );

        const balance = await fromUserAccount.getBalance(session);

        if (balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
                message: `Insufficient balance, current balance is ${balance}. Requested amount is ${amount}.`
            });
        }


        transaction = (await transactionModel.create([{
            fromAccount: fromUserAccount._id,
            toAccount: toUserAccount._id,
            amount,
            idempotencyKey,
            status: "PENDING"
        }], { session }))[0];

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session })

        const creditLedgerEntry = await ledgerModel.create([{
            account: toUserAccount._id,
            amount: amount,
            transaction: transaction._id,
            type: "CREDIT"
        }], { session })

        await transactionModel.findOneAndUpdate(
            { _id: transaction._id },
            { status: "COMPLETE" },
            { session }
        )

        await session.commitTransaction()
        session.endSession()

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        if (error.code === 11000) {
            return res.status(409).json({
                message: "Duplicate transaction request detected, Transaction is already in progress of completed."
            })
        }
        if (error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError')) {
            return res.status(409).json({
                message: "Concurrent transaction conflict detected, please retry."
            });
        }
        return res.status(500).json({
            message: "Transaction is failed due to asystem error, Please try again",
            error: error.message
        })
    }

    /**
     * 10.Send email notification
     */

    await sendtransactionMail(
        req.user.email, req.user.name, amount, toAccount
    )

    return res.status(201)
        .json({
            message: "Transaction completed successfully",
            transaction: transaction
        })
}

async function createInitialFundsTransaction(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({
            message: "toAccount,amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findOne({
        _id: toAccount
    })

    if (!toUserAccount) {
        return res.status(400).json({
            message: "toAccount is invalid"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if (!fromUserAccount) {
        return res.status(400).json({
            message: "SystemUser not found"
        })
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    const transaction = new transactionModel({
        fromAccount: fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"

    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT"
    }], { session })

    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT"
    }], { session })

    transaction.status = "COMPLETE"
    await transaction.save({ session })

    await session.commitTransaction()
    session.endSession()

    return res.status(201).json({
        message: "Initial funds transaction completed successfully",
        transaction: transaction
    })
}

async function getTransactionHistory(req, res) {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);

        const { status, startDate, endDate } = req.query;

        const userAccounts = await accountModel.find({
            user: req.user._id
        })

        const accountIds = userAccounts.map(acc => acc._id);

        const filter = {
            $or: [
                { fromAccount: { $in: accountIds } },
                { toAccount: { $in: accountIds } }
            ]
        };


        if (status) {
            filter.status = status;
        }

        if (startDate || endDate) {
            filter.createdAt = {};

            if (startDate) filter.createdAt.$gte = new Date(startDate);

            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const totalTransactions = await transactionModel.countDocuments(filter);

        const totalPages = Math.ceil(totalTransactions / limit);

        const skip = (page - 1) * limit;

        const transactions = await transactionModel.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "fromAccount",
                select: "accountNumber accountName user",
                populate: { path: "user", select: "name email" }
            })
            .populate({
                path: "toAccount",
                select: "accountNumber accountName user",
                populate: { path: "user", select: "name email" }
            })

        return res.status(200).json({
            transactions,
            pagination: {
                totalTransactions,
                totalPages,
                currentPage: page,
                limit
            }
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching transaction history", error: error.message });
    }
}

export { createTransaction, createInitialFundsTransaction, getTransactionHistory }