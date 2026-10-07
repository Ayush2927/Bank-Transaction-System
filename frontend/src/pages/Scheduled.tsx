import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, Plus, Trash2, ArrowRight, UserCheck, Building2, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface AccountRef {
  _id: string;
  accountName?: string;
  accountNumber?: string;
  accountType?: string;
  user?: {
    name?: string;
    email?: string;
  };
}

interface ScheduledItem {
  _id: string;
  amount: number;
  frequency: "ONCE" | "DAILY" | "WEEKLY" | "MONTHLY";
  nextExecutionDate: string;
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "CANCELLED";
  fromAccount?: AccountRef;
  toAccount?: AccountRef;
}

interface Contact {
  _id: string;
  name: string;
  accountNumber?: string;
  email?: string;
  phone?: string;
  bankName?: string;
}

export default function Scheduled() {
  const [scheduledList, setScheduledList] = useState<ScheduledItem[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Create Modal State
  const [showModal, setShowModal] = useState(false);
  const [fromAcc, setFromAcc] = useState("");
  const [toAcc, setToAcc] = useState("");
  const [amount, setAmount] = useState("500");
  const [frequency, setFrequency] = useState<"ONCE" | "DAILY" | "WEEKLY" | "MONTHLY">("MONTHLY");
  const [executionDate, setExecutionDate] = useState(new Date().toISOString().split("T")[0]);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Immediate Cron Worker Trigger State
  const [runLoading, setRunLoading] = useState(false);
  const [runResult, setRunResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchScheduled();
    fetchAccounts();
    fetchContacts();
  }, []);

  const fetchScheduled = async () => {
    try {
      const res = await api.get("/scheduled-transfers");
      setScheduledList(res.data.scheduledTransfers || []);
    } catch (e) {
      console.error("Failed to fetch scheduled transfers", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/user_accounts");
      const accList = res.data.accounts || [];
      setAccounts(accList);
      if (accList.length > 0) {
        setFromAcc(accList[0]._id);
      }
    } catch (e) {
      console.error("Failed to fetch accounts", e);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await api.get("/contacts");
      setContacts(res.data.contacts || []);
    } catch (e) {
      console.error("Failed to fetch contacts", e);
    }
  };

  // Other accounts owned by the user (excluding the chosen source account)
  const myOtherAccounts = accounts.filter((acc) => acc._id !== fromAcc);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setError(null);
    try {
      await api.post("/scheduled-transfers", {
        fromAccount: fromAcc,
        toAccount: toAcc.trim(),
        amount: Number(amount),
        frequency,
        executionDate,
      });
      setShowModal(false);
      setToAcc("");
      fetchScheduled();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to schedule transfer.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.delete(`/scheduled-transfers/${id}`);
      fetchScheduled();
    } catch (e) {
      console.error("Failed to cancel scheduled transfer", e);
    }
  };

  const handleRunDueTransfers = async () => {
    setRunLoading(true);
    setRunResult(null);
    try {
      const res = await api.post("/scheduled-transfers/execute-due");
      setRunResult({ type: "success", message: res.data.message });
      fetchScheduled();
      fetchAccounts();
    } catch (err: any) {
      setRunResult({
        type: "error",
        message: err.response?.data?.message || "Failed to execute due transfers."
      });
    } finally {
      setRunLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            Scheduled & Recurring Transfers
          </h2>
          <p className="text-sm text-gray-500">Automate recurring standing instructions for rent, investments, or family allowances.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRunDueTransfers}
            disabled={runLoading}
            className="flex items-center gap-2 border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
            title="Execute any active transfers that are due right now"
          >
            <Zap className={`w-4 h-4 text-amber-500 ${runLoading ? "animate-spin" : ""}`} />
            {runLoading ? "Processing Worker..." : "Process Due Now"}
          </Button>
          <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Schedule Transfer
          </Button>
        </div>
      </div>

      {/* Execution Feedback Banner */}
      {runResult && (
        <div
          className={`p-3.5 text-sm rounded-lg flex items-center justify-between gap-2 transition ${
            runResult.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {runResult.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{runResult.message}</span>
          </div>
          <button
            onClick={() => setRunResult(null)}
            className="text-xs opacity-70 hover:opacity-100 px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* List Grid */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-500">Loading scheduled transfers...</div>
      ) : scheduledList.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-900 dark:text-white">No Scheduled Transfers</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Set up an automated recurring payment so your ledger background worker processes payments on schedule.
          </p>
          <Button onClick={() => setShowModal(true)}>Schedule Your First Transfer</Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {scheduledList.map((item) => {
            const fromDisplay =
              item.fromAccount?.accountName ||
              (item.fromAccount?.accountNumber ? `A/C ...${item.fromAccount.accountNumber.slice(-4)}` : "Source Account");

            const toUserName = item.toAccount?.user?.name ? `${item.toAccount.user.name} - ` : "";
            const toDisplay =
              toUserName +
              (item.toAccount?.accountName ||
                (item.toAccount?.accountNumber ? `A/C ...${item.toAccount.accountNumber.slice(-4)}` : "Destination Account"));

            return (
              <Card key={item._id} className="p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Transfer Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                        <span>{fromDisplay}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-indigo-600 dark:text-indigo-400">{toDisplay}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-semibold text-gray-900 dark:text-gray-200">
                          {item.frequency}
                        </span>
                        <span>Next Run: {new Date(item.nextExecutionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount & Status Controls */}
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <div className="text-base font-bold text-gray-900 dark:text-white">
                        ₹{item.amount.toLocaleString()}
                      </div>
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : item.status === "COMPLETED"
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {item.status === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCancel(item._id)}
                        className="text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        title="Cancel Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal: Schedule Transfer */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Schedule Automated Transfer</h3>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Source Account */}
              <div className="space-y-1.5">
                <Label className="text-xs">From Account</Label>
                <select
                  value={fromAcc}
                  onChange={(e) => setFromAcc(e.target.value)}
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

              {/* Destination Quick Pick & Input */}
              <div className="space-y-2">
                <Label className="text-xs">Recipient / Destination Account</Label>

                {/* Quick Select Payee / Own Account Chips */}
                {(myOtherAccounts.length > 0 || contacts.length > 0) && (
                  <div className="space-y-1.5 pb-1">
                    <span className="text-[11px] text-gray-500">Quick Pick Payee or Own Account:</span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-gray-50 dark:bg-[#1a1a1a] rounded-md border border-gray-100 dark:border-gray-800">
                      {/* My other accounts */}
                      {myOtherAccounts.map((acc) => (
                        <button
                          key={acc._id}
                          type="button"
                          onClick={() => setToAcc(acc.accountNumber || acc._id)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                            toAcc === (acc.accountNumber || acc._id)
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-white dark:bg-[#222] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400"
                          }`}
                        >
                          <Building2 className="w-3 h-3 text-indigo-400" />
                          <span>{acc.accountName || "My Account"}</span>
                          <span className="opacity-70 text-[10px]">({acc.accountNumber?.slice(-4) || acc._id.slice(-4)})</span>
                        </button>
                      ))}

                      {/* Saved contacts */}
                      {contacts.map((c) => (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => setToAcc(c.accountNumber || c._id)}
                          className={`text-xs px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${
                            toAcc === (c.accountNumber || c._id)
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                              : "bg-white dark:bg-[#222] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-indigo-400"
                          }`}
                        >
                          <UserCheck className="w-3 h-3 text-emerald-500" />
                          <span>{c.name}</span>
                          {c.accountNumber && (
                            <span className="opacity-70 text-[10px]">({c.accountNumber.slice(-4)})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account Number Input */}
                <div className="relative">
                  <Input
                    placeholder="Enter 10-digit Account Number (e.g. 6028266599)"
                    value={toAcc}
                    onChange={(e) => setToAcc(e.target.value)}
                    className="pr-10"
                    required
                  />
                  {toAcc && (
                    <button
                      type="button"
                      onClick={() => setToAcc("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-500">
                  Standard 10-digit bank account number or select any saved payee above.
                </p>
              </div>

              {/* Amount & Frequency */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Frequency</Label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-md bg-gray-50 dark:bg-[#222] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white"
                  >
                    <option value="ONCE">ONCE (One-time)</option>
                    <option value="DAILY">DAILY (Every day)</option>
                    <option value="WEEKLY">WEEKLY (Every week)</option>
                    <option value="MONTHLY">MONTHLY (Every month)</option>
                  </select>
                </div>
              </div>

              {/* First Execution Date */}
              <div className="space-y-1.5">
                <Label className="text-xs">First Execution Date</Label>
                <Input
                  type="date"
                  value={executionDate}
                  onChange={(e) => setExecutionDate(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Scheduling..." : "Schedule Payment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
