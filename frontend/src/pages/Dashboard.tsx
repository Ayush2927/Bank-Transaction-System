import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRightLeft,
  CreditCard,
  PiggyBank,
  Clock,
  PieChart as PieIcon,
  Wallet,
  TrendingDown,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const CATEGORY_COLORS: { [key: string]: string } = {
  TRANSFER: "#3b82f6",
  FOOD: "#ef4444",
  SHOPPING: "#ec4899",
  UTILITIES: "#f59e0b",
  ENTERTAINMENT: "#8b5cf6",
  OTHER: "#6b7280",
};

export default function Dashboard() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Fetch user accounts
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.get("/accounts/user_accounts").then((res) => res.data),
  });

  // 2. Fetch transaction history
  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => api.get("/transactions/history").then((res) => res.data),
  });

  // 3. Fetch spending analytics
  const { data: analyticsData } = useQuery({
    queryKey: ["analytics"],
    queryFn: () => api.get("/analytics/spending").then((res) => res.data),
  });

  // 4. Fetch virtual cards
  const { data: cardsData } = useQuery({
    queryKey: ["cards"],
    queryFn: () => api.get("/cards").then((res) => res.data),
  });

  // 5. Fetch savings vaults
  const { data: vaultsData } = useQuery({
    queryKey: ["vaults"],
    queryFn: () => api.get("/vaults").then((res) => res.data),
  });

  const accounts = accountsData?.accounts || [];
  const recentTransactions = txData?.transactions?.slice(0, 6) || [];
  const totalBalance = accounts.reduce((acc: number, curr: any) => acc + (curr.balance || 0), 0);

  const categoryBreakdown = analyticsData?.categoryBreakdown || [];
  const totalMonthlySpend = categoryBreakdown.reduce((sum: number, item: any) => sum + (item.totalAmount || 0), 0);

  const virtualCards = cardsData?.virtualCards || cardsData?.cards || [];
  const activeCards = virtualCards.filter((c: any) => !c.isFrozen);

  const vaults = vaultsData?.vaults || [];
  const totalVaultSavings = vaults.reduce((sum: number, v: any) => sum + (v.currentAmount || 0), 0);
  const totalVaultTarget = vaults.reduce((sum: number, v: any) => sum + (v.targetAmount || 0), 0);
  const vaultProgressPercent =
    totalVaultTarget > 0 ? Math.min(100, Math.round((totalVaultSavings / totalVaultTarget) * 100)) : 0;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            NetBanking Overview
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time double-entry ledger telemetry, active cards, and account balances.
          </p>
        </div>

        {/* Quick Action Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/transfer">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs">
              <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
              Transfer Money
            </Button>
          </Link>
          <Link to="/cards">
            <Button variant="outline" size="sm" className="hover:border-blue-500">
              <CreditCard className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
              Virtual Cards
            </Button>
          </Link>
          <Link to="/vaults">
            <Button variant="outline" size="sm" className="hover:border-emerald-500">
              <PiggyBank className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
              Goal Vaults
            </Button>
          </Link>
          <Link to="/scheduled">
            <Button variant="outline" size="sm" className="hover:border-indigo-500">
              <Clock className="mr-1.5 h-3.5 w-3.5 text-indigo-500" />
              Standing Orders
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Executive KPI Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Liquid Assets */}
        <Card className="p-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Total Net Worth
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">
              ₹{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Across {accounts.length} liquid account{accounts.length === 1 ? "" : "s"}</span>
            </div>
          </div>
        </Card>

        {/* Card 2: Monthly Outflow */}
        <Card className="p-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-amber-300 dark:hover:border-amber-800 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Monthly Outflow
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">
              ₹{totalMonthlySpend.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              {categoryBreakdown.length} spending categories recorded
            </div>
          </div>
        </Card>

        {/* Card 3: Active Virtual Cards */}
        <Card className="p-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Virtual Cards
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">
              {virtualCards.length > 0 ? `${activeCards.length} Active` : "0 Issued"}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>{virtualCards.length > 0 ? "Visa • SHA-256 Protected" : "No cards issued yet"}</span>
              <Link to="/cards" className="text-blue-600 dark:text-blue-400 hover:underline">
                View &rarr;
              </Link>
            </div>
          </div>
        </Card>

        {/* Card 4: Savings Vaults Progress */}
        <Card className="p-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-800 transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              Goal Vaults Saved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold font-mono tracking-tight text-gray-900 dark:text-white">
              ₹{totalVaultSavings.toLocaleString()}
            </div>
            <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-between">
              <span>
                {totalVaultTarget > 0 ? `${vaultProgressPercent}% of ₹${totalVaultTarget.toLocaleString()}` : "No active vaults"}
              </span>
              <Link to="/vaults" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                Vaults &rarr;
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Middle Section: Spending Analytics & Linked Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Analytics (2 Columns on large screens) */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs h-full">
            <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <PieIcon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                      Spending Analytics
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Category allocation computed via MongoDB aggregation pipeline.
                    </CardDescription>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-gray-500 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  Live Aggregation
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {categoryBreakdown.length === 0 ? (
                <div className="h-[220px] flex flex-col items-center justify-center text-xs text-gray-400 space-y-2">
                  <PieIcon className="w-8 h-8 opacity-30" />
                  <p>No settled debit transactions recorded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6">
                  {/* Donut Chart */}
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          dataKey="totalAmount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {categoryBreakdown.map((entry: any, index: number) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CATEGORY_COLORS[entry.category] || CATEGORY_COLORS.OTHER}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#111",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            padding: "8px 12px",
                          }}
                          itemStyle={{ color: "#fff", fontSize: "12px" }}
                          formatter={(value: any) => `₹${Number(value).toLocaleString()}`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Category Legend List */}
                  <div className="space-y-2.5">
                    {categoryBreakdown.map((item: any) => (
                      <div key={item.category} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: CATEGORY_COLORS[item.category] || CATEGORY_COLORS.OTHER }}
                          />
                          <span className="font-medium text-gray-800 dark:text-zinc-200">{item.category}</span>
                        </div>
                        <div className="font-mono text-gray-500 dark:text-zinc-400">
                          ₹{item.totalAmount.toLocaleString()} ({item.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Linked Accounts Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-indigo-500" />
              <span>Linked Accounts ({accounts.length})</span>
            </h3>
            <Link to="/accounts" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              Manage &rarr;
            </Link>
          </div>

          {accountsLoading ? (
            <div className="p-6 text-center text-xs text-gray-400">Loading your accounts...</div>
          ) : accounts.length === 0 ? (
            <div className="p-6 text-center text-xs text-gray-400">No linked bank accounts found.</div>
          ) : (
            <div className="space-y-3">
              {accounts.map((acc: any) => {
                const accNo = acc.accountNumber || acc._id;
                const isCopied = copiedId === acc._id;
                return (
                  <Card
                    key={acc._id}
                    className="p-3.5 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:border-gray-300 dark:hover:border-zinc-700 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-xs text-gray-900 dark:text-white">
                          {acc.accountName || acc.accountType || "Savings Account"}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[11px] font-mono text-gray-500 dark:text-zinc-400">
                            A/C ...{accNo.slice(-4)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(accNo, acc._id)}
                            className="text-gray-400 hover:text-indigo-600 transition"
                            title="Copy Account Number"
                          >
                            {isCopied ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold font-mono text-gray-900 dark:text-white">
                          ₹{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                          {acc.accountType || "ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section: Recent Settled Ledger Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
          </div>
          <Link
            to="/transactions"
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Transactions</span>
            <ArrowRightLeft className="w-3 h-3" />
          </Link>
        </div>

        <Card className="border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {txLoading ? (
              <div className="p-8 text-center text-xs text-gray-400">Loading transaction history...</div>
            ) : recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">No settled transactions yet.</div>
            ) : (
              recentTransactions.map((tx: any) => {
                const isDebit = accounts.some((a: any) => a._id === tx.fromAccount?._id);
                const otherAccount = isDebit ? tx.toAccount : tx.fromAccount;
                const otherPartyName =
                  otherAccount?.user?.name || otherAccount?.accountName || (isDebit ? "Recipient" : "Sender");
                const otherPartyNumber = otherAccount?.accountNumber
                  ? `...${otherAccount.accountNumber.slice(-4)}`
                  : otherAccount?._id
                  ? `...${otherAccount._id.slice(-4)}`
                  : "N/A";

                return (
                  <div
                    key={tx._id}
                    className="p-3.5 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          isDebit
                            ? "bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-900/50"
                            : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-900/50"
                        )}
                      >
                        {isDebit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>
                            {isDebit ? `Transfer to ${otherPartyName}` : `Received from ${otherPartyName}`}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">({otherPartyNumber})</span>
                          {tx.category && (
                            <span className="text-[9px] uppercase font-bold tracking-wider bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 px-1.5 py-0.5 rounded">
                              {tx.category}
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 font-mono">
                          {new Date(tx.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "text-xs font-bold font-mono tabular-nums text-right",
                        isDebit ? "text-gray-900 dark:text-zinc-100" : "text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {isDebit ? "-" : "+"}₹{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
