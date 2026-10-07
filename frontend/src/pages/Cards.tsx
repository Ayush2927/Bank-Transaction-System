import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Unlock, Plus, ShoppingBag, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";

interface VirtualCardData {
  _id: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  isFrozen: boolean;
  monthlyLimit: number;
  account: { _id: string; balance?: number };
}

export default function Cards() {
  const [cards, setCards] = useState<VirtualCardData[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCVV, setShowCVV] = useState<{ [key: string]: boolean }>({});
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [limit, setLimit] = useState("1000");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Charge Simulator Modal State
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [chargeCardNumber, setChargeCardNumber] = useState("");
  const [chargeCVV, setChargeCVV] = useState("");
  const [chargeExpiry, setChargeExpiry] = useState("");
  const [merchantName, setMerchantName] = useState("Amazon.com");
  const [chargeAmount, setChargeAmount] = useState("49.99");
  const [chargeLoading, setChargeLoading] = useState(false);
  const [chargeResult, setChargeResult] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetchCards();
    fetchAccounts();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await api.get("/cards");
      setCards(res.data.virtualCards || res.data.cards || []);
    } catch (e) {
      console.error("Failed to fetch cards", e);
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

  const handleToggleFreeze = async (cardId: string) => {
    try {
      await api.patch(`/cards/${cardId}/freeze`);
      fetchCards();
    } catch (e) {
      console.error("Failed to toggle freeze", e);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);
    try {
      await api.post("/cards", {
        accountId: selectedAccountId,
        monthlyLimit: Number(limit)
      });
      setShowCreateModal(false);
      fetchCards();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || "Failed to generate virtual card.");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleSimulateCharge = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargeLoading(true);
    setChargeResult(null);
    try {
      const res = await api.post("/cards/charge", {
        cardNumber: chargeCardNumber,
        cvv: chargeCVV,
        expiryDate: chargeExpiry,
        merchantName,
        amount: Number(chargeAmount)
      });
      setChargeResult({ type: "success", message: res.data.message });
      fetchCards();
    } catch (err: any) {
      setChargeResult({ type: "error", message: err.response?.data?.message || "Charge Declined." });
    } finally {
      setChargeLoading(false);
    }
  };

  const openChargeSimulatorForCard = (card: VirtualCardData) => {
    setChargeCardNumber(card.cardNumber);
    setChargeExpiry(card.expiryDate);
    setChargeCVV("");
    setChargeResult(null);
    setShowChargeModal(true);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            Virtual Debit Cards
          </h2>
          <p className="text-sm text-gray-500">Manage 16-digit digital Visa cards for secure subscriptions and online shopping.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowChargeModal(true)} className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-500" />
            Simulate Merchant Charge
          </Button>
          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Issue New Card
          </Button>
        </div>
      </div>

      {/* Cards Deck Grid */}
      {loading ? (
        <div className="p-8 text-center text-sm text-gray-500">Loading virtual cards...</div>
      ) : cards.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-900 dark:text-white">No Virtual Cards Issued</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1 mb-4">
            Generate a digital card linked to your checking account to pay for Netflix, Claude, or online store trials safely.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>Issue Your First Virtual Card</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card._id} className="space-y-3">
              {/* Visual Digital Card */}
              <div
                className={`relative h-52 rounded-2xl p-6 text-white flex flex-col justify-between shadow-xl transition-all ${
                  card.isFrozen
                    ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 opacity-75"
                    : "bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 border border-white/10"
                }`}
              >
                {/* Top Row: Network & Status */}
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs tracking-wider uppercase font-semibold text-blue-300/80">
                    Virtual Visa
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full ${
                      card.isFrozen ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {card.isFrozen ? "FROZEN" : "ACTIVE"}
                  </span>
                </div>

                {/* Card Number */}
                <div className="font-mono text-lg tracking-[0.25em] font-medium text-white/90">
                  {card.cardNumber.replace(/(.{4})/g, "$1 ").trim()}
                </div>

                {/* Bottom Row: Holder, Expiry & CVV */}
                <div className="flex justify-between items-end text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Card Holder</div>
                    <div className="font-sans font-medium tracking-wide truncate max-w-[130px]">
                      {card.cardHolderName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider">Expires / CVV</div>
                    <div className="flex items-center gap-2">
                      <span>{card.expiryDate}</span>
                      <button
                        onClick={() => setShowCVV((prev) => ({ ...prev, [card._id]: !prev[card._id] }))}
                        className="text-blue-300 hover:text-white flex items-center gap-1"
                      >
                        {showCVV[card._id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showCVV[card._id] ? card.cvv : "***"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant={card.isFrozen ? "default" : "outline"}
                  onClick={() => handleToggleFreeze(card._id)}
                  className="flex-1 h-9 text-xs"
                >
                  {card.isFrozen ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Unfreeze Card
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-500" /> 1-Click Freeze
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => openChargeSimulatorForCard(card)}
                  className="h-9 text-xs"
                >
                  Test Charge
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Issue New Card */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Issue Digital Visa Card</h3>
            <form onSubmit={handleCreateCard} className="space-y-4">
              <div className="space-y-2">
                <Label>Select Bank Account</Label>
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
                <Label>Monthly Spending Limit (₹)</Label>
                <Input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  min={10}
                  required
                />
              </div>

              {createError && <p className="text-xs text-red-500">{createError}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Generating..." : "Generate Card"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Card Charge Simulator */}
      {showChargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-500">
              <ShoppingBag className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Merchant Charge Simulator</h3>
            </div>
            <p className="text-xs text-gray-500">Simulate paying a subscription or store with your 16-digit Virtual Card.</p>

            <form onSubmit={handleSimulateCharge} className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Merchant Store Name</Label>
                <Input value={merchantName} onChange={(e) => setMerchantName(e.target.value)} required />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">16-Digit Card Number</Label>
                <Input value={chargeCardNumber} onChange={(e) => setChargeCardNumber(e.target.value)} required />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Expiration (MM/YY)</Label>
                  <Input value={chargeExpiry} onChange={(e) => setChargeExpiry(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">CVV Security Code</Label>
                  <Input type="password" maxLength={3} placeholder="3 digits" value={chargeCVV} onChange={(e) => setChargeCVV(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Charge Amount (₹)</Label>
                <Input type="number" step="0.01" value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)} required />
              </div>

              {chargeResult && (
                <div
                  className={`p-3 text-xs rounded-md flex items-center gap-2 ${
                    chargeResult.type === "success" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  {chargeResult.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{chargeResult.message}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowChargeModal(false)}>
                  Close
                </Button>
                <Button type="submit" disabled={chargeLoading}>
                  {chargeLoading ? "Processing..." : "Process Charge"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
