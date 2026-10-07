import { useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggle2FA = async () => {
    setToggleLoading(true);
    setMessage(null);
    try {
      const res = await api.post("/auth/toggle-2fa");
      setIs2FAEnabled(res.data.is2FAEnabled);
      setMessage(res.data.message);
    } catch (e: any) {
      setMessage(e.response?.data?.message || "Failed to toggle 2FA.");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.post("/auth/logout");
      window.location.href = "/";
    } catch (e) {
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h2>
        <p className="text-sm text-gray-500">Manage your security and account preferences.</p>
      </div>

      {/* 🔐 Two-Factor Authentication Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-base font-medium">Two-Factor Authentication (2FA)</CardTitle>
          </div>
          <CardDescription>
            Protect your bank account with an extra layer of security via email OTP codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Email 2FA Verification</p>
              <p className="text-xs text-gray-500">
                Status: {is2FAEnabled ? <span className="text-emerald-500 font-semibold">ENABLED</span> : <span className="text-amber-500 font-semibold">DISABLED</span>}
              </p>
            </div>
            <Button
              variant={is2FAEnabled ? "destructive" : "default"}
              onClick={handleToggle2FA}
              disabled={toggleLoading}
            >
              {toggleLoading ? "Updating..." : is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>

          {message && (
            <p className="text-xs font-medium text-blue-500 bg-blue-500/10 p-2.5 rounded-md">
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <LogOut className="w-5 h-5 text-gray-500" />
            <CardTitle className="text-base font-medium">Session Management</CardTitle>
          </div>
          <CardDescription>
            Securely sign out of your current session and clear tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? "Signing out..." : "Sign out"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
