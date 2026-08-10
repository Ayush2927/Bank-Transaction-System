import { vaultModel } from "../models/vault.model.js";
import { accountModel } from "../models/account.model.js";

async function createVault(req, res) {
    try {

        const { accountId, name, targetAmount } = req.body;

        if (!accountId || !name || !targetAmount) {
            return res.status(400).json({
                message: "accountId,name and targetAmount are required"
            })
        };

        const account = await accountModel.findById({
            _id: accountId,
            user: req.user._id
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found or unauthorized"
            })
        };

        const vault = await vaultModel.create({
            user: req.user._id,
            account: account._id,
            name,
            targetAmount: Number(targetAmount),
            currentAmount: 0

        });

        return res.status(201).json({
            message: "Vault created successfully",
            vault
        });



    } catch (error) {
        return res.status(500).json({
            message: "Error creating vault",
            error: error.message
        });
    }
}

export { createVault }