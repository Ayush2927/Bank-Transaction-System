import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound, 
  Database, 
  Zap, 
  Layers, 
  ChevronDown,
  Terminal,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SecurityProduct() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-foreground flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#111] border-b border-border/80 shadow-xs px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
              BL
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-blue-950 dark:text-white leading-tight">
                BANK LEDGER
              </div>
              <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">
                Digital Core
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
            <Link to="/features/scheduled-transfers" className="hover:text-foreground transition-colors">Scheduled Transfers</Link>
            <Link to="/features/virtual-cards" className="hover:text-foreground transition-colors">Virtual Cards</Link>
            <Link to="/features/savings-vaults" className="hover:text-foreground transition-colors">Savings Vaults</Link>
            <Link to="/features/security" className="text-foreground font-semibold border-b-2 border-blue-600 pb-0.5">Security & Ledgers</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login?mode=register">
            <Button variant="outline" size="sm" className="font-medium text-xs">
              Register
            </Button>
          </Link>
          <Link to="/login">
            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              LOGIN
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="bg-gradient-to-br from-[#0c2340] via-[#102d53] to-[#0a192f] text-white py-16 px-6 lg:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Zero Double-Spend Architecture</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Cryptographic Trust in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
                Every Single Ledger Entry.
              </span>
            </h1>

            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Unlike ordinary web apps with single mutable balance counters, Bank Ledger calculates balance dynamically via double-entry aggregation with immutable append-only ledger entries.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Double-Entry Debit & Credit pairing for all funds movements</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>SHA-256 Hashing at rest for OTPs and Virtual Card CVVs</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Biometric / Email Two-Factor Authentication (2FA) with rate limiting</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-950 font-bold px-6 text-sm shadow-lg">
                  Open a Secured Account <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Terminal / Ledger Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gray-950 p-5 border border-white/10 shadow-2xl font-mono text-xs space-y-3 text-gray-300">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ledger Isolation Engine</span>
                </div>
                <span className="text-emerald-400">VERIFIED</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="text-blue-400">$ transaction.startSession()</div>
                <div className="text-gray-400 pl-2">&gt; Idempotency Check: PASSED</div>
                <div className="text-gray-400 pl-2">&gt; Balance Verification: ₹25,000 &gt;= ₹1,000</div>
                <div className="text-emerald-400 pl-2">+ LEDGER DEBIT: Account A (-₹1,000)</div>
                <div className="text-emerald-400 pl-2">+ LEDGER CREDIT: Account B (+₹1,000)</div>
                <div className="text-blue-400">$ session.commitTransaction()</div>
                <div className="text-gray-400 pl-2">&gt; Zero Discrepancy Integrity: 100%</div>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-gray-400">
                <span>Hash: SHA-256</span>
                <span>Latency: 14ms</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECURITY PILLARS */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Defense-in-Depth Banking Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Architected to withstand adversarial attacks, network partitions, and concurrent double-spends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Mathematical Integrity</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Account balances are not arbitrary fields. They are calculated dynamically by aggregating all historical ledger credits minus debits.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Hashed Secrets At Rest</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Passwords use bcrypt salt hashing, while OTP verification codes and virtual card CVVs are hashed with SHA-256 before storage.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Idempotency Locks</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every transfer generates a unique idempotency key. Network retries or rapid double-clicks never result in double transfers.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="mt-auto bg-gray-100 dark:bg-[#0c0c0c] border-t border-border/80 text-xs text-muted-foreground py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              BL
            </div>
            <span className="font-semibold text-foreground">Bank Ledger Core</span>
            <span>• Security & Compliance</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <Link to="/login" className="hover:text-foreground">Login</Link>
            <Link to="/login" className="hover:text-foreground">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
