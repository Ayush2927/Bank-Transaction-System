import { Link } from "react-router-dom";
import { 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  CreditCard, 
  PiggyBank, 
  Clock, 
  CheckCircle2, 
  Zap, 
  Globe2, 
  Search,
  ChevronDown,
  Sparkles,
  Smartphone,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-foreground flex flex-col selection:bg-blue-600 selection:text-white">
      
      {/* 1. MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#111] border-b border-border/80 shadow-xs px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Bank Logo */}
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

          {/* Primary Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-muted-foreground">
            <Link to="/features/scheduled-transfers" className="hover:text-foreground transition-colors">Scheduled Transfers</Link>
            <Link to="/features/virtual-cards" className="hover:text-foreground transition-colors">Virtual Cards</Link>
            <Link to="/features/savings-vaults" className="hover:text-foreground transition-colors">Savings Vaults</Link>
            <Link to="/features/security" className="hover:text-foreground transition-colors">Security & Ledgers</Link>
          </nav>
        </div>

        {/* Right Action Bar */}
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

      {/* 2. HERO SECTION WITH MACBOOK/DASHBOARD PREVIEW */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0c2340] via-[#102d53] to-[#0a192f] text-white py-16 px-6 lg:py-24">
        {/* Subtle Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs px-3 py-1 rounded-full backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Double-Entry Cryptographic Banking Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-[1.15]">
              Bank Ledger's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-300">
                All-New NetBanking
              </span>
            </h1>

            <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed max-w-xl">
              Experience zero double-spend guarantees, instant peer transfers with biometric 2FA, virtual disposable cards, and automated savings vaults.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant IMPS/NEFT transfers with strict isolation levels</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hashed OTP & SHA-256 CVV security at rest</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-blue-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic spending analytics and intelligent categorisation</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link to="/login">
                <Button size="lg" className="bg-white hover:bg-gray-100 text-blue-950 font-bold px-6 text-sm shadow-lg hover:shadow-xl transition-all">
                  Access NetBanking <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link to="/login?mode=register">
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold px-5 text-sm backdrop-blur-sm">
                  Register New Account
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Hero: Modern Laptop Frame Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto rounded-xl bg-gray-900 p-2.5 shadow-2xl ring-1 ring-white/20">
              {/* Laptop Camera dot */}
              <div className="flex items-center justify-between pb-2 px-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <div className="text-[10px] text-gray-400 font-mono">netbanking.bankledger.internal</div>
                <div className="w-4" />
              </div>

              {/* Simulated Live Portal UI */}
              <div className="rounded-lg bg-[#111] p-4 text-white space-y-4 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="text-[11px] text-gray-400">Welcome Back,</div>
                    <div className="text-base font-bold">Ayush Mahapatro</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                      ● 2FA SECURED
                    </span>
                  </div>
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-[10px] text-gray-400 uppercase font-medium">Primary Savings A/C</div>
                    <div className="text-xl font-bold mt-1 text-emerald-400">₹25,000.00</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">A/C ...4829</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <div className="text-[10px] text-gray-400 uppercase font-medium">Virtual Visa Platinum</div>
                    <div className="text-xl font-bold mt-1 text-blue-400">₹50,000 Limit</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">•••• 8821 (Active)</div>
                  </div>
                </div>

                {/* Quick Transaction Simulator */}
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2">
                  <div className="text-xs font-semibold flex items-center justify-between">
                    <span>Recent Double-Entry Movements</span>
                    <span className="text-[10px] text-blue-400">Real-time</span>
                  </div>
                  <div className="text-xs flex items-center justify-between text-gray-300">
                    <span>Salary Wire Credit</span>
                    <span className="text-emerald-400 font-mono font-medium">+₹25,000.00</span>
                  </div>
                  <div className="text-xs flex items-center justify-between text-gray-300">
                    <span>Merchant Charge (Amazon India)</span>
                    <span className="text-gray-300 font-mono font-medium">-₹1,249.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 3 KEY PILLARS (Convenient, Comprehensive, Secure) */}
      <section id="features" className="py-16 px-6 bg-gray-50 dark:bg-[#0f0f0f] border-b border-border">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built on Modern Banking Fundamentals
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your personal finances with institutional precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white dark:bg-[#161616] p-6 rounded-xl border border-border/80 shadow-xs space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Convenient & Instant</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bank from your home, mobile, or workstation 24x7. Execute peer transfers with 1-click address book autofill.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white dark:bg-[#161616] p-6 rounded-xl border border-border/80 shadow-xs space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Comprehensive Suite</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Integrated savings vaults, recurring standing instructions, and virtual credit cards in one unified portal.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white dark:bg-[#161616] p-6 rounded-xl border border-border/80 shadow-xs space-y-4 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground">Double-Entry Security</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rest assured with zero double-spend anomalies, SHA-256 OTP/CVV encryption, and 6-digit 2FA protection.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FEATURE SHOWCASE (Virtual Cards & Automated Goals) */}
      <section id="virtual-cards" className="py-16 px-6 max-w-6xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase">Virtual Cards Engine</div>
            <h3 className="text-2xl font-bold tracking-tight text-foreground">
              Generate 16-Digit Cards for Safe E-Commerce
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Never expose your primary account number on shopping websites. Generate virtual debit cards with customized monthly spending limits and 1-click Freeze/Unfreeze controls.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button size="sm" className="text-xs">
                  Create Virtual Card <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-xl space-y-6">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>VIRTUAL DEBIT</span>
              <span className="font-bold text-white tracking-widest">VISA</span>
            </div>
            <div className="py-2">
              <div className="text-lg font-mono tracking-widest">4892 •••• •••• 9921</div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <div>
                <div className="text-[9px] text-gray-400 uppercase">Cardholder</div>
                <div className="font-semibold">AYUSH MAHAPATRO</div>
              </div>
              <div>
                <div className="text-[9px] text-gray-400 uppercase">Expires</div>
                <div className="font-mono">09/29</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="mt-auto bg-gray-100 dark:bg-[#0c0c0c] border-t border-border/80 text-xs text-muted-foreground py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
              BL
            </div>
            <span className="font-semibold text-foreground">Bank Ledger Core</span>
            <span>• Enterprise Financial Ledger</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/login" className="hover:text-foreground">Login</Link>
            <Link to="/login?mode=register" className="hover:text-foreground">Register</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-4 pt-4 border-t border-border/40 text-[11px] text-center text-muted-foreground">
          © {new Date().getFullYear()} Bank Ledger System. All transactions strictly processed through ACID double-entry accounting.
        </div>
      </footer>

    </div>
  );
}
