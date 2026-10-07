import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  AlertCircle, 
  CheckCircle2, 
  UserCheck, 
  Plus, 
  Bookmark, 
  ArrowRight, 
  ShieldCheck, 
  Wallet, 
  X, 
  FileText, 
  Receipt,
  Copy,
  Clock,
  Send,
  AlertTriangle
} from "lucide-react";

export default function Transfer() {
  const queryClient = useQueryClient();

  // Primary Form State
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("TRANSFER");
  const [remarks, setRemarks] = useState("");
  
  // Resolved Recipient Details (when selected from address book or resolved)
  const [selectedPayeeName, setSelectedPayeeName] = useState<string | null>(null);

  // Address Book / Saved Contacts State
  const [newContactName, setNewContactName] = useState("");
  const [newContactAccount, setNewContactAccount] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);

  // UI Flow Modals State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // 1. Fetch user accounts to calculate balances and populate dropdown
  const { data: accountsData, isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => api.get("/accounts/user_accounts").then((res) => res.data),
  });

  // 2. Fetch saved address book contacts
  const { data: contactsData, refetch: refetchContacts } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => api.get("/contacts").then((res) => res.data),
  });

  const accounts = accountsData?.accounts || [];
  const contacts = contactsData?.contacts || [];

  // 3. Dynamic Balance Preview of the currently selected source account
  const selectedSourceAccount = useMemo(() => {
    return accounts.find((acc: any) => acc._id === fromAccount) || null;
  }, [accounts, fromAccount]);

  const availableBalance = selectedSourceAccount?.balance ?? 0;
  const numericAmount = Number(amount) || 0;

  // 4. Real-time Validation Checks
  const isOverBalance = fromAccount !== "" && numericAmount > availableBalance;
  const isSelfTransfer = fromAccount !== "" && toAccount !== "" && fromAccount.trim() === toAccount.trim();
  const isPositiveAmount = numericAmount > 0;
  
  // Submit is valid only when all mandatory criteria pass
  const isFormValid = 
    fromAccount !== "" && 
    toAccount.trim() !== "" && 
    isPositiveAmount && 
    !isOverBalance && 
    !isSelfTransfer;

  // 5. Transfer Mutation with Error & Success Handling
  const transferMutation = useMutation({
    mutationFn: (data: any) => api.post("/transactions", data),
    onSuccess: (response, variables) => {
      // Invalidate queries so dashboard & accounts reflect updated balances immediately
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });

      // Build portfolio-grade receipt payload
      const tx = response.data?.transaction || {};
      setReceiptData({
        referenceId: tx._id || `TXN_${crypto.randomUUID().slice(0, 12).toUpperCase()}`,
        idempotencyKey: variables.idempotencyKey,
        fromAccountName: selectedSourceAccount?.accountName || selectedSourceAccount?.accountType || "Primary Account",
        fromAccountNumber: selectedSourceAccount?.accountNumber || selectedSourceAccount?._id,
        toAccount: variables.toAccount,
        recipientName: selectedPayeeName || "Verified Account",
        amount: variables.amount,
        category: variables.category,
        remarks: remarks.trim() || "No remarks specified",
        timestamp: new Date().toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "medium"
        })
      });

      // Close confirmation modal & reset inputs
      setShowConfirmModal(false);
      setFormError(null);
      setAmount("");
      setRemarks("");
      setToAccount("");
      setSelectedPayeeName(null);
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || "Transfer authorization failed. Please verify account details.");
      setShowConfirmModal(false);
    }
  });

  // Handle Payee Chip Selection from Address Book
  const handleSelectPayee = (contact: any) => {
    const accId = contact.targetAccount?._id || contact.targetAccount;
    setToAccount(accId);
    setSelectedPayeeName(contact.name);
    setFormError(null);
  };

  // Add Contact to Address Book
  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/contacts", {
        name: newContactName,
        targetAccountId: newContactAccount
      });
      setNewContactName("");
      setNewContactAccount("");
      setShowAddContact(false);
      refetchContacts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to save contact.");
    }
  };

  // Open Confirmation Modal on Form Submit
  const handleOpenReviewModal = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSelfTransfer) {
      setFormError("Self-transfer disallowed: Source and destination accounts cannot be identical.");
      return;
    }
    if (isOverBalance) {
      setFormError(`Insufficient funds: Transfer amount exceeds available balance (₹${availableBalance.toLocaleString()}).`);
      return;
    }
    if (!isPositiveAmount) {
      setFormError("Transfer amount must be greater than ₹0.00.");
      return;
    }

    setShowConfirmModal(true);
  };

  // Authorize & Execute Transfer API
  const handleAuthorizeTransfer = () => {
    const idempotencyKey = crypto.randomUUID();
    transferMutation.mutate({
      fromAccount,
      toAccount: toAccount.trim(),
      amount: numericAmount,
      category,
      idempotencyKey,
      remarks: remarks.trim()
    });
  };

  // Copy Reference ID
  const handleCopyRefId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-2">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-sm font-semibold text-foreground tracking-tight">Fund Transfer & Payments</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Execute instant transfers between your accounts or send money to third-party beneficiaries with double-entry integrity.
        </p>
      </div>

      {/* Global Error Banner */}
      {formError && (
        <div className="flex items-center gap-2.5 text-xs text-destructive bg-destructive/10 p-3.5 rounded-lg border border-destructive/20 animate-in fade-in duration-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">{formError}</span>
        </div>
      )}

      {/* Address Book Quick-Select Chips */}
      <Card className="shadow-none border border-border/60">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>Saved Payees & Address Book</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowAddContact(!showAddContact)} 
              className="text-xs h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/40"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Payee
            </Button>
          </div>

          {showAddContact && (
            <form onSubmit={handleAddContact} className="p-3 bg-muted/40 rounded-lg space-y-2 mb-3 border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input 
                  placeholder="Payee Full Name (e.g. Alice Sharma)" 
                  value={newContactName} 
                  onChange={(e) => setNewContactName(e.target.value)} 
                  required 
                  className="text-xs h-8"
                />
                <Input 
                  placeholder="24-Character Account ID" 
                  value={newContactAccount} 
                  onChange={(e) => setNewContactAccount(e.target.value)} 
                  required 
                  className="text-xs h-8 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowAddContact(false)} className="text-xs h-7">
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="text-xs h-7">
                  Save Contact
                </Button>
              </div>
            </form>
          )}

          {contacts.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No saved contacts yet. Add frequent payees above for fast 1-click autofill.
            </p>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {contacts.map((c: any) => {
                const targetId = c.targetAccount?._id || c.targetAccount;
                const isSelected = toAccount === targetId;
                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => handleSelectPayee(c)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shrink-0 transition-all ${
                      isSelected 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20"
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Transfer Form Card */}
      <Card className="shadow-none border border-border">
        <CardContent className="p-6">
          <form onSubmit={handleOpenReviewModal} className="space-y-5">
            
            {/* 1. From Account Selector & Dynamic Balance Preview */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">From Account (Source)</Label>
              <select
                required
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
                value={fromAccount}
                onChange={(e) => {
                  setFromAccount(e.target.value);
                  setFormError(null);
                }}
                disabled={accountsLoading || transferMutation.isPending}
              >
                <option value="" disabled className="text-muted-foreground bg-background">
                  Select source account
                </option>
                {accounts.map((acc: any) => (
                  <option key={acc._id} value={acc._id} className="text-foreground bg-background">
                    {acc.accountName || acc.accountType || "Savings Account"} ({acc.accountNumber ? `A/C ...${acc.accountNumber.slice(-4)}` : `...${acc._id.slice(-4)}`}) - ₹{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </option>
                ))}
              </select>

              {/* Live Dynamic Available Balance Badge */}
              {selectedSourceAccount && (
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Wallet className="w-3.5 h-3.5 text-blue-500" />
                    <span>Available Balance:</span>
                    <strong className="text-foreground font-mono font-semibold">
                      ₹{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </strong>
                  </div>
                  {isOverBalance && (
                    <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Exceeds available balance
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 2. Destination Account Number / ID with Payee Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">To Account (Beneficiary)</Label>
                {selectedPayeeName && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Verified: {selectedPayeeName}
                  </span>
                )}
              </div>
              <Input
                required
                placeholder="Enter 24-character recipient account ID or select from address book"
                value={toAccount}
                onChange={(e) => {
                  setToAccount(e.target.value);
                  setSelectedPayeeName(null);
                  setFormError(null);
                }}
                disabled={transferMutation.isPending}
                className="text-xs font-mono h-10"
              />
              {isSelfTransfer && (
                <p className="text-[11px] text-red-500 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Source and destination accounts cannot be the same.
                </p>
              )}
            </div>

            {/* 3. Amount & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Amount (₹)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">₹</span>
                  <Input
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      setFormError(null);
                    }}
                    disabled={transferMutation.isPending}
                    className={`pl-7 text-xs font-mono h-10 ${isOverBalance ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">Spending Category</Label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="TRANSFER">TRANSFER (Standard Wire)</option>
                  <option value="FOOD">FOOD & DINING</option>
                  <option value="SHOPPING">SHOPPING</option>
                  <option value="UTILITIES">UTILITIES & BILLS</option>
                  <option value="ENTERTAINMENT">ENTERTAINMENT</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>

            {/* 4. Remarks / Description (Optional Text Input) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Remarks / Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                placeholder="e.g. Office rent, Dinner split, Freelance invoice"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={transferMutation.isPending}
                maxLength={100}
                className="text-xs h-10"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button 
                type="submit" 
                className="w-full h-10 text-xs font-semibold"
                disabled={!isFormValid || transferMutation.isPending}
              >
                Proceed to Confirmation <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 4. TRANSFER CONFIRMATION MODAL (Two-Step Review Flow) */}
      {/* ========================================================================= */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-border rounded-xl shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Authorize Fund Transfer</h3>
                  <p className="text-[11px] text-muted-foreground">Verify transaction parameters before dispatching.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowConfirmModal(false)}
                disabled={transferMutation.isPending}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Amount Summary Pill */}
            <div className="p-4 rounded-lg bg-muted/40 border border-border text-center space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Total Transfer Amount</span>
              <div className="text-3xl font-extrabold text-foreground tabular-nums font-mono">
                ₹{numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Transfer Parameter Ledger Details */}
            <div className="space-y-2.5 text-xs divide-y divide-border/60">
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">Debiting From</span>
                <span className="font-medium text-foreground text-right">
                  {selectedSourceAccount?.accountName || selectedSourceAccount?.accountType || "Primary"}
                  <span className="block text-[10px] font-mono text-muted-foreground">
                    {selectedSourceAccount?.accountNumber ? `A/C ...${selectedSourceAccount.accountNumber.slice(-4)}` : `...${fromAccount.slice(-6)}`}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Crediting To</span>
                <span className="font-medium text-foreground text-right">
                  {selectedPayeeName || "Beneficiary Account"}
                  <span className="block text-[10px] font-mono text-muted-foreground">
                    ...{toAccount.slice(-8)}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium text-foreground uppercase font-mono text-[11px]">
                  {category}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Remarks</span>
                <span className="font-medium text-foreground italic">
                  {remarks.trim() ? `"${remarks.trim()}"` : "None"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-muted-foreground">Processing Fee</span>
                <span className="font-mono text-emerald-600 font-semibold text-xs">
                  ₹0.00 (Free NetBanking)
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmModal(false)}
                disabled={transferMutation.isPending}
                className="flex-1 text-xs h-9"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAuthorizeTransfer}
                disabled={transferMutation.isPending}
                className="flex-1 text-xs h-9 font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {transferMutation.isPending ? "Authorizing..." : "Authorize & Send"}
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SUCCESS FEEDBACK & TRANSACTION RECEIPT SCREEN */}
      {/* ========================================================================= */}
      {receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs px-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-border rounded-xl shadow-2xl space-y-5">
            
            {/* Success Header */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">Transfer Successful!</h3>
              <p className="text-xs text-muted-foreground">
                Funds have been debited and credited via double-entry settlement.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
              <div className="text-center pb-2 border-b border-border">
                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Amount Transferred</div>
                <div className="text-2xl font-extrabold text-foreground font-mono tabular-nums mt-0.5">
                  ₹{Number(receiptData.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-2 text-xs">
                {/* Transaction Reference ID with Copy Button */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reference ID</span>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-foreground font-semibold">
                    <span className="max-w-[140px] truncate">{receiptData.referenceId}</span>
                    <button 
                      onClick={() => handleCopyRefId(receiptData.referenceId)}
                      className="p-1 hover:text-foreground text-muted-foreground transition-colors"
                      title="Copy Reference ID"
                    >
                      {copiedId ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date & Time</span>
                  <span className="font-mono text-muted-foreground text-[11px]">{receiptData.timestamp}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Sender Account</span>
                  <span className="font-medium text-foreground">{receiptData.fromAccountName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Recipient</span>
                  <span className="font-medium text-foreground">{receiptData.recipientName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Remarks</span>
                  <span className="font-medium text-foreground italic">{receiptData.remarks}</span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3" /> SETTLED
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <Button 
                onClick={() => setReceiptData(null)} 
                className="w-full h-10 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              >
                Make Another Transfer
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
