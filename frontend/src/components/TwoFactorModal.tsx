import { useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Mail, AlertCircle } from "lucide-react";

interface TwoFactorModalProps {
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TwoFactorModal({ email, onSuccess, onCancel }: TwoFactorModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/verify-otp", { email, otp });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setResendSuccess(null);
    try {
      await api.post("/auth/send-otp", { email });
      setResendSuccess("A new 6-digit OTP code was sent to your email!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Two-Factor Verification
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5">
            <Mail className="w-4 h-4" />
            Sent 6-digit code to <span className="font-medium text-gray-900 dark:text-gray-200">{email}</span>
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              6-Digit OTP Code
            </label>
            <Input
              type="text"
              maxLength={6}
              placeholder="e.g. 482910"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[0.5em] font-mono uppercase h-14"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="p-3 text-xs text-emerald-500 bg-emerald-500/10 rounded-lg text-center font-medium">
              {resendSuccess}
            </div>
          )}

          <Button type="submit" className="w-full h-11" disabled={loading || otp.length !== 6}>
            {loading ? "Verifying..." : "Verify & Sign In"}
          </Button>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
          <button onClick={handleResend} type="button" className="hover:underline font-medium text-blue-500">
            Resend Code
          </button>
          <button onClick={onCancel} type="button" className="hover:underline text-gray-500">
            Back to Login
          </button>
        </div>

      </div>
    </div>
  );
}
