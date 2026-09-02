import { accountModel } from "../models/account.model.js";

function generateAccountNumber() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
}


async function createAccount(req, res) {
    try {


        const user = req.user;
        const { accountName, accountType } = req.body;

        const account = await accountModel.create({
            user: user._id,
            accountNumber: generateAccountNumber(),
            accountName: accountName || "Primary Account",
            accountType: accountType || "CURRENT"
        })

        res.status(201).json({
            account
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error creating account",
            error: error.message
        })
    }
}


async function getUserAccounts(req, res) {
    const accounts = await accountModel.find({
        user: req.user._id
    })

    const accountsWithBalance = await Promise.all(
        accounts.map(async (acc) => {
            const balance = await acc.getBalance();
            return {
                ...acc.toObject(),
                balance
            }
        })
    );

    res.status(200).json({
        accounts: accountsWithBalance
    })
}

async function getAccountBalance(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })

}

export { createAccount, getUserAccounts, getAccountBalance }