import { transactionModel } from "../models/transaction.model.js";
import { virtualCardModel } from "../models/virtualCard.model.js";
import { accountModel } from "../models/account.model.js";
import { ledgerModel } from "../models/ledger.model.js";
import mongoose from "mongoose";
import crypto from "crypto";

function generate16DigitNumber() {
    let number = "4";
    for (let i = 0; i < 15; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}


function generateCVV() {
    return Math.floor(100 + Math.random() * 900).toString();
}

function generateExpiryDate() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear() + 3).slice(-2);
    return `${month}/${year}`;
}

async function createCard(req, res) {
    try {
        const { accountId, monthlyLimit } = req.body;

        if (!accountId) {
            return res.status(400).json({
                message: "account id is required"
            })
        };

        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found or account not unauthorized"
            })
        };

        const cardNumber = generate16DigitNumber();
        const rawCVV = generateCVV();
        const hashedCVV = crypto.createHash("sha256").update(rawCVV).digest("hex");
        const expiryDate = generateExpiryDate();

        const virtualCard = await virtualCardModel.create({
            user: req.user._id,
            account: account._id,
            cardNumber,
            cardHolderName: req.user.name.toUpperCase(),
            expiryDate,
            cvv: hashedCVV, // Hashed at rest in MongoDB!
            isFrozen: false,
            monthlyLimit: monthlyLimit ? Number(monthlyLimit) : 1000
        });

        return res.status(201).json({
            message: "Virtual debit card created successfully",
            virtualCard: {
                ...virtualCard.toObject(),
                cvv: rawCVV // Return raw CVV once on creation for user display
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error in creating virtual debit card",
            error: error.message
        })
    }
}

async function getUserVirtualCards(req, res) {
    try {

        const virtualCards = await virtualCardModel.find({ user: req.user._id })
            .populate("account")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            virtualCards
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching virtual cards",
            error: error.message
        })
    }
}


async function toggleFreezeCard(req, res) {
    try {

        const { id } = req.params

        const virtualCard = await virtualCardModel.findOne({ _id: id, user: req.user._id });

        if (!virtualCard) {
            return res.status(404).json({
                message: "Card not found"
            })
        };

        virtualCard.isFrozen = !virtualCard.isFrozen;
        await virtualCard.save();

        return res.status(200).json({
            message: `Card ${virtualCard.isFrozen ? "FROZEN" : "UNFROZEN"} successfully`,
            virtualCard
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error toggling card freeze status",
            error: error.message
        })
    }
}

async function chargeCard(req, res) {
    try {

        const { cardNumber, cvv, expiryDate, merchantName = "Online Merchant", amount } = req.body;

        if (!cardNumber || !cvv || !amount) {
            return res.status(400).json({
                message: "cardNumber, cvv and amount are required"
            })
        }

        const chargeAmount = Number(amount);
        if (chargeAmount <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than 0"
            })
        };

        const virtualCard = await virtualCardModel.findOne({ cardNumber });
        if (!virtualCard) {
            return res.status(404).json({
                message: "Invalid card number"
            })
        };

        const hashedInputCVV = crypto.createHash("sha256").update(cvv).digest("hex");

        if (virtualCard.cvv !== hashedInputCVV || virtualCard.expiryDate !== expiryDate) {
            return res.status(400).json({
                message: "Invalid cvv or expiryDate. Charge Declined."
            })
        };

        if (virtualCard.isFrozen) {
            return res.status(400).json({
                message: "Transaction delcined, card is currently frozen"
            })
        };

        const account = await accountModel.findById(virtualCard.account);
        const balance = await account.getBalance();

        if (balance < chargeAmount) {
            return res.status(400).json({
                message: "Transaction Declined. Insufficient Balance"
            })
        };

        // execute Ledger Debit

        const session = await mongoose.startSession();
        session.startTransaction();

        const idempotencyKey = `card_charge_${virtualCard._id}_${Date.now()}_${crypto.randomUUID()}`;
        const [transaction] = await transactionModel.create([{
            fromAccount: account._id,
            toAccount: account._id,
            amount: chargeAmount,
            idempotencyKey,
            status: "COMPLETE"
        }], { session })

        await ledgerModel.create([{
            account: account._id,
            amount: chargeAmount,
            transaction: transaction._id,
            type: "DEBIT"
        }], { session });

        await session.commitTransaction();
        session.endSession();


        return res.status(200).json({
            message: `Successfully charged ₹${chargeAmount} at ${merchantName}!`,
            remainingBalance: balance - chargeAmount,
            status: "APPROVED"
        });




    } catch (error) {
        return res.status(500).json({
            message: "Error processing card charge",
            error: error.message
        }
        )
    }
}

export { createCard, getUserVirtualCards, toggleFreezeCard, chargeCard };

