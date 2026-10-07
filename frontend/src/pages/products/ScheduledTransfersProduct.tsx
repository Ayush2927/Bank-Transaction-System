import { Link } from "react-router-dom";
import { 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Calendar, 
  Repeat, 
  Bell, 
  ChevronDown,
  Layers,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ScheduledTransfersProduct() {
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
            <Link to="/features/scheduled-transfers" className="text-foreground font-semibold border-b-2 border-blue-600 pb-0.5">Scheduled Transfers</Link>
            <Link to="/features/virtual-cards" className="hover:text-foreground transition-colors">Virtual Cards</Link>
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
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-indigo-300" />
              <span>Cron-Driven Automated Banking Daemon</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Automate Bills, SIPs & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
                Recurring Payouts.
              </span>
            </h1>

            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Never miss rent, utility bills, or monthly family allowances again. Set up standing instructions that execute on strict schedules with idempotent double-entry execution.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Flexible execution cycles: DAILY, WEEKLY, MONTHLY, or ONCE</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated background runner with failure notifications</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant 1-click schedule cancellation anytime</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <Link to="/login">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-950 font-bold px-6 text-sm shadow-lg">
                  Set Up Schedule <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Schedule Feed Mockup */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-gray-900/90 p-5 border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold">Active Standing Instructions</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                  Daemon: Active
                </span>
              </div>

              {/* Item 1 */}
              <div className="bg-white/5 p-3 rounded-lg flex items-center justify-between border border-white/5">
                <div>
                  <div className="text-xs font-semibold text-white">Flat Rent Wire</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">MONTHLY • Next: 1st of Month</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-emerald-400">₹18,500.00</div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="bg-white/5 p-3 rounded-lg flex items-center justify-between border border-white/5">
                <div>
                  <div className="text-xs font-semibold text-white">Weekly Index SIP</div>
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">WEEKLY • Every Monday</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-emerald-400">₹2,500.00</div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    ACTIVE
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How The Automated Ledger Executes
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            Engineered with strict isolation and atomic double-entry execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">1. Configure Cadence</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pick your source account, destination beneficiary, execution frequency, and transfer amount in ₹ (INR).
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">2. Cron Job Evaluation</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Our automated daemon polls pending instructions at scheduled intervals and verifies source account balance in real-time.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/80 space-y-3 bg-card shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-base text-foreground">3. Atomic Settlement</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Credits and debits are executed inside an ACID transaction session, dispatching immediate email confirmations upon success.
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
            <span>• Automated Transfers Platform</span>
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
