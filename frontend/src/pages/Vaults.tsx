import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PiggyBank, Plus, ArrowUpRight, ArrowDownLeft, Target, AlertCircle } from "lucide-react";

interface VaultData {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  progressPercentage?: number;
  account: string;
}

export default function Vaults() {
  const [vaults, setVaults] = useState<VaultData[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Vault State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [vaultName, setVaultName] = useState("");
  const [targetAmount, setTargetAmount] = useState("1000");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Deposit/Withdraw Modal State
  const [activeVault, setActiveVault] = useState<VaultData | null>(null);
  const [operationType, setOperationType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
  const [opAmount, setOpAmount] = useState("50");
  const [opLoading, setOpLoading] = useState(false);
  const [opError, setOpError] = useState<string | null>(null);

  useEffect(() => {
    fetchVaults();
    fetchAccounts();
  }, []);

  const fetchVaults = async () => {
    try {
      const res = await api.get("/vaults");
      setVaults(res.data.vaults || []);
    } catch (e) {
      console.error("Failed to fetch vaults", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/user_accounts");
      setAccounts(res.data.accounts || []);
      if (res.data.accounts?.length > 0) {
        setSelectedAccountId(res.data.accounts[0]._id);
      }
    } catch (e) {
      console.error("Failed to fetch accounts", e);
    }
  };

  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      await api.post("/vaults", {
        accountId: selectedAccountId,
        name: vaultName,
        targetAmount: Number(targetAmount)
      });
      setShowCreateModal(false);
      setVaultName("");
      fetchVaults();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to create vault.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleVaultOperation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVault) return;
    setOpLoading(true);
    setOpError(null);
    try {
      const endpoint = operationType === "DEPOSIT" ? `/vaults/${activeVault._id}/deposit` : `/vaults/${activeVault._id}/withdraw`;
      await api.post(endpoint, { amount: Number(opAmount) });
      setActiveVault(null);
      fetchVaults();
    } catch (err: any) {
      setOpError(err.response?.data?.message || `Failed to ${operationType.toLowerCase()}.`);
    } finally {
      setOpLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-500" />
            Savings Vaults & Goals
          </h2>
          <p className="text-sm text-gray-500">Lock money away into goal lockers separate from your checking balance.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Goal Vault
        </Button>
      </div>

      {/* Vaults Grid */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-500">Loading savings vaults...</div>
      ) : vaults.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-900 dark:text-white">No Goal Vaults Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Set aside funds for a new laptop, emergency fund, or vacation trip with goal locking.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>Create Your First Vault</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => {
            const progress = vault.targetAmount > 0 ? Math.min(Math.round((vault.currentAmount / vault.targetAmount) * 100), 100) : 0;
            return (
              <Card key={vault._id} className="relative overflow-hidden border border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-semibold">{vault.name}</CardTitle>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                      {progress}% Saved
                    </span>
                  </div>
                  <CardDescription className="text-xs flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" /> Target: ₹{vault.targetAmount.toLocaleString()}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Saved Amount</span>
                      <span className="font-bold text-gray-900 dark:text-white">₹{vault.currentAmount.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveVault(vault);
                        setOperationType("DEPOSIT");
                        setOpError(null);
                      }}
                      className="text-xs flex items-center gap-1"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" /> Deposit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveVault(vault);
                        setOperationType("WITHDRAW");
                        setOpError(null);
                      }}
                      className="text-xs flex items-center gap-1"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" /> Withdraw
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal 1: Create Vault */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Goal Vault</h3>
            <form onSubmit={handleCreateVault} className="space-y-4">
              <div className="space-y-2">
                <Label>Linked Account</Label>
                <select
                  value={selectedAccountId}
                  onChange={(e) => setSelectedAccountId(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white"
                  required
                >
                  {accounts.length === 0 ? (
                    <option value="" disabled>No accounts available</option>
                  ) : (
                    accounts.map((acc) => (
                      <option key={acc._id} value={acc._id}>
                        {acc.accountName || "Account"} ({acc.accountNumber ? `A/C ...${acc.accountNumber.slice(-4)}` : `...${acc._id.slice(-4)}`}) - ₹{acc.balance}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Vault Name</Label>
                <Input
                  placeholder="e.g. Emergency Fund, New Car"
                  value={vaultName}
                  onChange={(e) => setVaultName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Target Savings Goal (₹)</Label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  min={1}
                  required
                />
              </div>

              {createError && <p className="text-xs text-red-500">{createError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Create Vault"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Deposit / Withdraw Modal */}
      {activeVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {operationType === "DEPOSIT" ? "Deposit to" : "Withdraw from"} {activeVault.name}
            </h3>

            <form onSubmit={handleVaultOperation} className="space-y-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={opAmount}
                  onChange={(e) => setOpAmount(e.target.value)}
                  min={1}
                  required
                />
              </div>

              {opError && (
                <div className="flex items-center gap-2 p-3 text-xs text-red-500 bg-red-500/10 rounded-md">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{opError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setActiveVault(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={opLoading}>
                  {opLoading ? "Processing..." : operationType === "DEPOSIT" ? "Confirm Deposit" : "Confirm Withdraw"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
