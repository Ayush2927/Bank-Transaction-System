import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, Search, X, Copy, CheckCircle2, ShieldCheck, Calendar, ArrowRightLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function Accounts() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);
  const [accountType, setAccountType] = useState("SAVINGS");
  const [accountName, setAccountName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const { data, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.get("/accounts/user_accounts").then((res) => res.data),
  });

  const createAccountMutation = useMutation({
    mutationFn: (payload: { accountName: string; accountType: string }) => api.post("/accounts", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setShowCreate(false);
      setAccountName("");
    },
  });

  const allAccounts = data?.accounts || [];

  // Filter accounts by search query (by account name, account number, or internal ID)
  const filteredAccounts = allAccounts.filter((acc: any) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase().trim();
    const name = (acc.accountName || acc.accountType || "").toLowerCase();
    const accNo = (acc.accountNumber || "").toLowerCase();
    const id = (acc._id || "").toLowerCase();
    return name.includes(q) || accNo.includes(q) || id.includes(q);
  });

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-[13px] font-semibold text-foreground tracking-tight">Your Accounts</h2>
          <p className="text-[13px] text-muted-foreground mt-1">Manage your balances and view account details.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by name, A/C no, or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-9"
            />
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} size="sm">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            New Account
          </Button>
        </div>
      </div>

      {/* New Account Creation Form */}
      {showCreate && (
        <Card className="shadow-none bg-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-foreground">Account Name</Label>
                <Input
                  placeholder="e.g. Salary Account, Daily Expenses"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[13px] font-medium text-foreground">Account Type</Label>
                <select 
                  value={accountType} 
                  onChange={(e) => setAccountType(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="SAVINGS" className="bg-background text-foreground">Savings</option>
                  <option value="CURRENT" className="bg-background text-foreground">Current</option>
                  <option value="SALARY" className="bg-background text-foreground">Salary</option>
                  <option value="BUSINESS" className="bg-background text-foreground">Business</option>
                </select>
              </div>
              <Button 
                onClick={() => createAccountMutation.mutate({ accountName, accountType })}
                disabled={createAccountMutation.isPending}
              >
                {createAccountMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Accounts Grid */}
      {isLoading ? (
        <div className="text-[13px] text-muted-foreground">Loading accounts...</div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-[13px] font-semibold text-foreground tracking-tight mb-2">
            {search ? "No matching accounts found" : "No accounts found"}
          </h3>
          <p className="text-[13px] text-muted-foreground">
            {search ? "Try searching with a different name, A/C number, or ID." : "Create an account to start managing your funds."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map((acc: any) => (
            <Card 
              key={acc._id} 
              onClick={() => setSelectedAccount(acc)}
              className="shadow-none hover:border-foreground/30 transition-all cursor-pointer group hover:shadow-md"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-full border border-border/50 bg-muted/50 flex items-center justify-center transition-colors group-hover:bg-muted group-hover:border-border">
                    <Wallet className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-secondary text-secondary-foreground border border-border/50 uppercase tracking-wider">
                    {acc.accountName || acc.accountType}
                  </span>
                </div>
                <div className="text-2xl font-semibold tracking-tight tabular-nums mb-1 text-foreground">
                  ₹{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center justify-between text-[13px] text-muted-foreground font-mono mt-1">
                  <span>{acc.accountNumber ? `A/C ...${acc.accountNumber.slice(-4)}` : `A/C ...${acc._id.slice(-4)}`}</span>
                  <span className="text-[11px] text-blue-500 font-sans group-hover:underline">View details →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-lg p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedAccount.accountName || selectedAccount.accountType || "Bank Account"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedAccount.accountType || "SAVINGS"} • {selectedAccount.currency || "INR"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAccount(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Balance Banner */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-zinc-900/60 border border-border/50">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Available Balance</div>
              <div className="text-3xl font-bold tracking-tight text-foreground mt-1 tabular-nums">
                ₹{selectedAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Details Table */}
            <div className="space-y-3 divide-y divide-border/60 text-sm">
              {/* Account Number */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground text-xs">Account Number</span>
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground">
                  <span>{selectedAccount.accountNumber || selectedAccount._id}</span>
                  <button 
                    onClick={() => handleCopy(selectedAccount.accountNumber || selectedAccount._id, "accNo")}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                    title="Copy Account Number"
                  >
                    {copiedField === "accNo" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Account ID (Internal ObjectId) */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground text-xs">Account ID (System ID)</span>
                <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <span className="max-w-[200px] truncate">{selectedAccount._id}</span>
                  <button 
                    onClick={() => handleCopy(selectedAccount._id, "accId")}
                    className="text-muted-foreground hover:text-foreground p-0.5"
                    title="Copy Account ID"
                  >
                    {copiedField === "accId" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground text-xs">Account Status</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3" />
                  {selectedAccount.status || "ACTIVE"}
                </span>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground text-xs">Opened On</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {selectedAccount.createdAt ? new Date(selectedAccount.createdAt).toLocaleDateString() : "Active"}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Link to="/transfer" className="flex-1">
                <Button className="w-full text-xs h-9">
                  <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" /> Transfer from this Account
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setSelectedAccount(null)} className="text-xs h-9">
                Close
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
