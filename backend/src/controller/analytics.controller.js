import { transactionModel } from "../models/transaction.model.js";
import { accountModel } from "../models/account.model.js";

async function getSpendingAnalytics(req, res) {
    try {
        const userAccounts = await accountModel.find({ user: req.user._id });

        const accountIds = userAccounts.map(acc => acc._id);

        const analyticsData = await transactionModel.aggregate([
            {
                $match: {
                    fromAccount: { $in: accountIds },
                    status: "COMPLETE"
                }
            },

            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },

            {
                $sort: { totalAmount: -1 }
            }
        ])

        const grandTotal = analyticsData.reduce((sum, item) => sum + item.totalAmount, 0);


        const categoryBreakdown = analyticsData.map(item => ({
            category: item._id || "OTHER",
            totalAmount: item.totalAmount,
            transactionCount: item.count,
            percentage: grandTotal > 0 ? Math.round((item.totalAmount / grandTotal) * 100) : 0
        }))

        return res.status(200).json({
            grandTotal,
            categoryBreakdown
        })

    } catch (error) {
        return res.status(500).json({
            message: "Error generating spending analytics",
            error: error.message
        })
    }
}

export { getSpendingAnalytics }