import { vaultModel } from "../models/vault.model.js";
import { accountModel } from "../models/account.model.js";

// Create Vaults
async function createVault(req, res) {
    try {

        const { accountId, name, targetAmount } = req.body;

        if (!accountId || !name || !targetAmount) {
            return res.status(400).json({
                message: "accountId,name and targetAmount are required"
            })
        };

        const account = await accountModel.findOne({
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

//Get all user Vaults
async function getUserVaults(req, res) {
    try {
        const vaults = await vaultModel.find(
            { user: req.user._id }).populate("account").sort({ createdAt: -1 });


        const vaultsWithProgress = vaults.map(vault => {
            const progressPercentage = Math.min(
                Math.round((vault.currentAmount / vault.targetAmount) * 100), 100
            );

            return {
                ...vault.toObject(),
                progressPercentage
            };
        });

        return res.status(200).json({
            vaults: vaultsWithProgress
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error fetching vaults",
            error: error.message
        });
    }
}

// Depoit money into a vault
async function depositToVault(req, res) {
    try {
        const { id } = req.params
        const { amount } = req.body;

        const depositAmount = Number(amount);

        if (!depositAmount || depositAmount <= 0) {
            return res.status(400).json({
                message: "Deposit amount must be greater than 0"
            })
        };

        const vault = await vaultModel.findOne({ _id: id, user: req.user._id });

        if (!vault) {
            return res.status(404).json({ message: "Vault not found" });
        }

        const account = await accountModel.findById(vault.account);
        const currentBalance = await account.getBalance();

        if (currentBalance < depositAmount) {
            return res.status(400).json({
                message: `Insufficient balance. Available:${currentBalance}, Requested Deposit:${depositAmount}`
            })
        };

        vault.currentAmount += depositAmount;
        await vault.save();

        return res.status(200).json({
            message: `Amount ${depositAmount} successfully deposited into ${vault.name}`,
            vault
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error encountered while trying to deposit money into the vault",
            error: error.message
        })
    }
}

async function withdrawFromVault(req, res) {
    try {
        const { id } = req.params;
        const { amount } = req.body;

        const withdrawAmount = Number(amount);

        if (!withdrawAmount || withdrawAmount <= 0) {
            return res.status(400).json({
                message: "Amount to be withdrawn cannot be less than or equal to 0"
            })
        };

        const vault = await vaultModel.findOne({ _id: id, user: req.user._id })

        if (!vault) {
            return res.status(404).json({
                message: "Vault not found"
            })
        };

        if (vault.currentAmount < withdrawAmount) {
            return res.status(400).json({
                message: `Insufificent vault funds. Vault balance:${vault.currentAmount}, Requested:${withdrawAmount}`
            })
        };

        vault.currentAmount -= withdrawAmount;
        await vault.save();

        return res.status(200).json({
            message: `Amount ${withdrawAmount} withdrwan from vault ${vault.name}`,
            vault
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error withdrawing from vault",
            error: error.message
        })
    }
}



export { createVault, getUserVaults, depositToVault, withdrawFromVault }