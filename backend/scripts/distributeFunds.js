import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { accountModel } from "../src/models/account.model.js";
import { transactionModel } from "../src/models/transaction.model.js";
import { ledgerModel } from "../src/models/ledger.model.js";
import User from "../src/models/user.model.js";

async function distributeFunds() {
    try {
        const uri = process.env.MONGO_DB_URI || process.env.MONGO_URI;
        if (!uri) {
            throw new Error("MONGO_DB_URI not found in .env");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(uri);
        console.log("Connected to MongoDB successfully.");

        // 1. Find or create the Central Bank System User
        let systemUser = await User.findOne({ 
            $or: [
                { email: "system@test.com" },
                { systemUser: true }
            ] 
        }).select("+systemUser");

        if (!systemUser) {
            console.log("Creating Central Bank System User...");
            systemUser = await User.create({
                name: "Central Reserve Bank",
                email: "system@test.com",
                password: "systemPassword123#",
                systemUser: true
            });
        } else if (!systemUser.systemUser) {
            systemUser.systemUser = true;
            await systemUser.save();
        }

        console.log(`System User: ${systemUser.name} (${systemUser._id})`);

        // 2. Find or create System Master Account
        let systemAccount = await accountModel.findOne({ user: systemUser._id });
        if (!systemAccount) {
            console.log("Creating System Treasury Account...");
            systemAccount = await accountModel.create({
                user: systemUser._id,
                accountName: "Central Reserve Treasury",
                accountNumber: "9999999999",
                accountType: "BUSINESS"
            });
        }

        console.log(`System Account ID: ${systemAccount._id}`);

        // 3. Find all registered customer accounts (excluding system account)
        const targetAccounts = await accountModel.find({ 
            user: { $ne: systemUser._id } 
        });

        if (targetAccounts.length === 0) {
            console.log("No customer accounts found to distribute funds to.");
            process.exit(0);
        }

        const AMOUNT_TO_DISTRIBUTE = 10000; // ₹10,000 to each account
        console.log(`Found ${targetAccounts.length} accounts. Distributing ₹${AMOUNT_TO_DISTRIBUTE.toLocaleString()} to each...`);

        let successCount = 0;

        for (const account of targetAccounts) {
            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                const idempotencyKey = `system_seed_${account._id}_${Date.now()}`;

                const [transaction] = await transactionModel.create([{
                    fromAccount: systemAccount._id,
                    toAccount: account._id,
                    amount: AMOUNT_TO_DISTRIBUTE,
                    idempotencyKey,
                    status: "COMPLETE",
                    category: "TRANSFER"
                }], { session });

                await ledgerModel.create([{
                    account: systemAccount._id,
                    amount: AMOUNT_TO_DISTRIBUTE,
                    transaction: transaction._id,
                    type: "DEBIT"
                }], { session });

                await ledgerModel.create([{
                    account: account._id,
                    amount: AMOUNT_TO_DISTRIBUTE,
                    transaction: transaction._id,
                    type: "CREDIT"
                }], { session });

                await session.commitTransaction();
                session.endSession();

                const newBalance = await account.getBalance();
                console.log(`✅ Credited ₹${AMOUNT_TO_DISTRIBUTE} to Account: ${account.accountName || account.accountType || account._id} -> New Balance: ₹${newBalance.toLocaleString()}`);
                successCount++;
            } catch (err) {
                await session.abortTransaction();
                session.endSession();
                console.error(`❌ Failed to credit account ${account._id}:`, err.message);
            }
        }

        console.log(`\n🎉 Distribution Complete! Successfully funded ${successCount}/${targetAccounts.length} accounts with ₹${AMOUNT_TO_DISTRIBUTE.toLocaleString()} each.`);
        process.exit(0);

    } catch (error) {
        console.error("Distribution script error:", error);
        process.exit(1);
    }
}

distributeFunds();
