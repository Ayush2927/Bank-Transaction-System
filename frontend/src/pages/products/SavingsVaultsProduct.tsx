import { Link } from "react-router-dom";
import { 
  PiggyBank, 
  Target, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Layers,
  ArrowDownLeft,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavingsVaultsProduct() {
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
            <Link to="/features/savings-vaults" className="text-foreground font-semibold border-b-2 border-blue-600 pb-0.5">Savings Vaults</Link>
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
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs px-3 py-1 rounded-full">
              <PiggyBank className="w-3.5 h-3.5 text-emerald-300" />
              <span>Goal-Based Financial Planning</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Lock Away Savings for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-blue-300">
                What Matters Most.
              </span>
            </h1>

            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Create separate digital lockers for your Emergency Fund, Next Vacation, or Dream Car. Ring-fence your money from everyday debit card spend, with instant withdrawability when you need it.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Target Goals with live percentage progress tracking</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero lock-in penalties: Deposit or withdraw funds instantly</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Atomic ledger transactions tied directly to your primary account</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-950 font-bold px-6 text-sm shadow-lg">
                  Create Goal Vault <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Goal Vault Showcase Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gray-900/90 p-5 border border-white/10 shadow-2xl space-y-4">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold text-white">Emergency Fund Vault</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  75% Saved
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Current Saved</span>
                  <span className="font-bold font-mono text-emerald-400 text-sm">₹75,000.00</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-3/4" />
                </div>
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Target: ₹1,00,000.00</span>
                  <span>₹25,000 to go</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <div className="bg-white/5 p-2 rounded text-center text-xs">
                  <div className="text-[10px] text-gray-400">Monthly Avg Growth</div>
                  <div className="font-bold text-emerald-400 mt-0.5">+₹12,500/mo</div>
                </div>
                <div className="bg-white/5 p-2 rounded text-center text-xs">
                  <div className="text-[10px] text-gray-400">Liquidity Status</div>
                  <div className="font-bold text-white mt-0.5">Instant Access</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. IMMERSIVE VAULT ADVANTAGES */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Smart Savings with Strict Separation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Traditional savings accounts make it too easy to overspend. Vaults isolate your long-term goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Psychological Separation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When funds are in a vault, they don't show up in your casual debit spending balance, keeping you focused on your target.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Live Progress Telemetry</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Visual progress bars and analytics motivate you to complete goals faster and monitor compounding milestones.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">Instant Redemption</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Emergencies happen. Withdraw money from your vault back into your primary account with 1 click in less than 200 milliseconds.
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
            <span>• Savings Vaults Platform</span>
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
