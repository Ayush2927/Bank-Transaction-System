import { Link } from "react-router-dom";
import { 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Sliders, 
  RefreshCw, 
  Eye, 
  Zap,
  Globe2,
  Search,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VirtualCardsProduct() {
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
            <Link to="/features/virtual-cards" className="text-foreground font-semibold border-b-2 border-blue-600 pb-0.5">Virtual Cards</Link>
            <Link to="/features/savings-vaults" className="hover:text-foreground transition-colors">Savings Vaults</Link>
            <Link to="/features/security" className="hover:text-foreground transition-colors">Security & Ledgers</Link>
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
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              <span>Zero Account Exposure for E-Commerce</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Virtual Platinum Debit Cards <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
                Created in Seconds.
              </span>
            </h1>

            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Shield your actual bank account from data breaches. Generate separate 16-digit debit cards with customized monthly spending limits, instant freeze toggles, and encrypted CVVs at rest.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Monthly Spending Limits in Indian Rupees (₹)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1-Click Freeze & Unfreeze switch with immediate lock</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Integrated Merchant Charge Simulator for testing</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-950 font-bold px-6 text-sm shadow-lg">
                  Generate Your Card <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Card Mockup Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-2xl border border-white/20">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-5 rounded bg-yellow-400/90 shadow-sm" />
                  <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Contactless</span>
                </div>
                <span className="font-extrabold text-lg italic tracking-widest text-white">VISA</span>
              </div>

              <div className="space-y-4">
                <div className="font-mono text-xl tracking-widest text-gray-100">
                  4829 •••• •••• 9182
                </div>

                <div className="flex justify-between items-end text-xs pt-2">
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase">Cardholder</div>
                    <div className="font-semibold tracking-wide">AYUSH MAHAPATRO</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] text-gray-400 uppercase">Expires / CVV</div>
                    <div className="font-mono">09/29 •••</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Monthly Cap: <strong className="text-white">₹25,000</strong></span>
                  <span className="text-emerald-400 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded">
                    ● ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. IMMERSIVE FEATURE BREAKDOWN */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Built for Total Spending Defense
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Why security-conscious individuals never swipe their primary savings card online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Budget Safeguards</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Define strict monthly limits per card. Even if an unscrupulous website attempts an overcharge, the transaction is instantly rejected.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Immediate 1-Click Freeze</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Suspicious activity? Freeze your card in 10 milliseconds from your dashboard. Unfreeze just as easily whenever you want to shop.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">SHA-256 Hashed CVV</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Raw 3-digit CVVs are never stored in plaintext in the database. Every CVV verification runs through cryptographic SHA-256 validation.
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
            <span>• Virtual Cards Platform</span>
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
