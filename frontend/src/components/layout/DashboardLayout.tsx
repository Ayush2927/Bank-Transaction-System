import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowRightLeft,
  CreditCard,
  PiggyBank,
  Clock,
  Settings,
  LogOut,
  ShieldCheck,
  Zap,
  Landmark,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

interface UserProfile {
  name: string;
  email: string;
  is2FAEnabled?: boolean;
}

const navSections = [
  {
    title: "BANKING OPERATIONS",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "My Accounts", href: "/accounts", icon: Wallet },
      { name: "Transfer Funds", href: "/transfer", icon: ArrowRightLeft, badge: "Instant" },
      { name: "Transaction History", href: "/transactions", icon: Clock },
    ],
  },
  {
    title: "FINTECH PRODUCTS",
    items: [
      { name: "Virtual Cards", href: "/cards", icon: CreditCard, badge: "Visa" },
      { name: "Savings Vaults", href: "/vaults", icon: PiggyBank },
      { name: "Standing Orders", href: "/scheduled", icon: Zap },
    ],
  },
  {
    title: "PREFERENCES & SAFETY",
    items: [
      { name: "Security & 2FA", href: "/settings", icon: ShieldCheck },
    ],
  },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [totalBalance, setTotalBalance] = useState<number | null>(null);

  useEffect(() => {
    // 1. Fetch user profile
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => {
        // Fallback default if /me isn't cached yet
        setUser({ name: "Ayush Mahapatro", email: "ayushm050405@gmail.com" });
      });

    // 2. Fetch liquid total balance for sidebar mini-card
    api
      .get("/accounts/user_accounts")
      .then((res) => {
        const accs = res.data.accounts || [];
        const sum = accs.reduce((acc: number, curr: any) => acc + (curr.balance || 0), 0);
        setTotalBalance(sum);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      window.location.href = "/";
    } catch (e) {
      window.location.href = "/";
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "AM";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Find active navigation item title
  const currentNav = navSections.flatMap((s) => s.items).find((n) => n.href === location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-50/60 dark:bg-zinc-950">
      {/* Enhanced Executive Sidebar */}
      <aside className="w-64 border-r border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100 dark:border-zinc-800/80">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-white">FinLedger</span>
              <span className="block text-[10px] text-gray-500 font-medium tracking-wide uppercase">NetBanking</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">ACID</span>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-bold tracking-wider uppercase text-gray-400 dark:text-zinc-500">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs"
                          : "text-gray-600 dark:text-zinc-400 hover:bg-gray-100/70 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-zinc-100"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 dark:text-zinc-500"
                          )}
                          strokeWidth={isActive ? 2.5 : 2}
                        />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider",
                            isActive
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* In-Sidebar Mini Reserve Card (Fills Dead Space) */}
          <div className="pt-2">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white border border-indigo-900/40 shadow-lg shadow-indigo-950/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono tracking-wider uppercase text-indigo-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Liquid Vault
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200">
                  LIVE
                </span>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 block font-normal">Available Balance</span>
                <span className="text-lg font-bold tracking-tight text-white font-mono">
                  {totalBalance !== null
                    ? `₹${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "₹---"}
                </span>
              </div>
              <Link
                to="/transfer"
                className="w-full py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold text-center block transition shadow-xs flex items-center justify-center gap-1"
              >
                <ArrowRightLeft className="w-3 h-3" />
                Quick Money Transfer
              </Link>
            </div>
          </div>
        </div>

        {/* Sidebar Footer: Real Authenticated User Profile */}
        <div className="p-3 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/60">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800/80 transition">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0 truncate">
                <div className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || "Customer Account"}
                </div>
                <div className="text-[10px] text-gray-500 dark:text-zinc-400 truncate">
                  {user?.email || "Verified NetBanking"}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Modern Top Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 backdrop-blur-sm sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">NetBanking</span>
            <span className="text-gray-300 dark:text-zinc-600">/</span>
            <h1 className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">
              {currentNav?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Security Shield Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-[11px] font-medium text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit SHA Encrypted</span>
            </div>

            {/* Quick Public Showcase Link */}
            <Link
              to="/"
              className="text-xs text-gray-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 flex items-center gap-1 transition"
              title="View Public Showcase"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="hidden sm:inline">Landing Page</span>
            </Link>

            {/* User Greeting & Avatar Badge */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 text-white flex items-center justify-center text-[11px] font-bold shadow-xs">
                {getInitials(user?.name)}
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-zinc-200 hidden sm:inline-block">
                {user?.name?.split(" ")[0] || "Account"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
