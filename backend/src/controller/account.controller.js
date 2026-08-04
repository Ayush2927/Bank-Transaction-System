import { accountModel } from "../models/account.model.js";


async function createAccount(req, res) {
    const user = req.user;
    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })
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