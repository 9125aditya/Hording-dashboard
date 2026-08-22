"use client";

import { useState, useTransition } from "react";
import { confirmBookingByClient } from "@/backend/actions/booking-actions";
import { CheckCircle2, Loader2, AlertCircle, Sparkles } from "lucide-react";

export default function ConfirmBookingClient({
  token,
  isConfirmedInitial,
  isExpired,
  confirmedAt,
}: {
  token: string;
  isConfirmedInitial: boolean;
  isExpired: boolean;
  confirmedAt?: string;
}) {
  const [isConfirmed, setIsConfirmed] = useState(isConfirmedInitial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    setError(null);
    startTransition(async () => {
      const res = await confirmBookingByClient(token);
      if (res.success) {
        setIsConfirmed(true);
      } else {
        setError(res.error || "Failed to confirm reservation.");
      }
    });
  };

  if (isConfirmed) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 animate-in zoom-in-95 duration-300">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-inner">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-emerald-900">Reservation Confirmed!</h3>
        <p className="text-xs text-emerald-700 max-w-sm mx-auto">
          Thank you! Your reservation confirmation has been recorded. Our team will contact you shortly with the campaign execution schedule.
        </p>
        {confirmedAt && (
          <p className="text-[11px] text-emerald-600 font-medium pt-1">
            Confirmed on {new Date(confirmedAt).toLocaleString("en-IN")}
          </p>
        )}
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-amber-900">5-Day Hold Expired</h3>
        <p className="text-xs text-amber-700 max-w-sm mx-auto">
          This 5-day hold period has lapsed. Please reach out to your account executive to check current availability and re-reserve this site.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleConfirm}
        disabled={isPending}
        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Confirming Reservation...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>Confirm My Reservation Now</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-500 text-center">
        By clicking confirm, you notify our team to lock this reservation for your campaign.
      </p>
    </div>
  );
}
