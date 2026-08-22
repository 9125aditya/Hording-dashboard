import { getBookingByConfirmationToken } from "@/backend/actions/booking-actions";
import ConfirmBookingClient from "./ConfirmBookingClient";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, Building2, MapPin, Calendar, User, Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BookingConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const resolvedParams = await searchParams;
  const token = resolvedParams.token;

  if (!token) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Booking Link</h1>
          <p className="text-sm text-gray-500 mb-6">
            The booking confirmation link is missing or invalid. Please check the URL from your email or contact our support team.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const booking = await getBookingByConfirmationToken(token);

  if (!booking) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Reservation Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">
            We could not find an active reservation associated with this confirmation token. It may have expired or been cancelled.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Explore Available Sites
          </Link>
        </div>
      </div>
    );
  }

  const isConfirmed = booking.status === "CONFIRMED";
  const formattedExpiry = new Date(booking.expiresAt).toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-6 sm:px-8 py-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md mb-3 border border-white/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">SellAds OOH Media</h1>
            <p className="text-indigo-100 text-sm mt-1">Hoarding Reservation &amp; Booking Confirmation</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center pb-2">
              <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600">Reservation Request For</p>
              <h2 className="text-xl font-bold text-gray-900 mt-0.5">{booking.clientName}</h2>
              {booking.clientEmail && (
                <p className="text-xs text-gray-500 mt-0.5">{booking.clientEmail}</p>
              )}
            </div>

            {/* Site & Booking Details Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reserved Hoarding</span>
                  <p className="text-base font-bold text-gray-900 leading-snug">{booking.siteName}</p>
                </div>
              </div>

              {booking.bookingPeriod && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested Period</span>
                    <p className="text-sm font-semibold text-indigo-900">{booking.bookingPeriod}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
                <User className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Executive</span>
                  <p className="text-sm font-semibold text-gray-800">{booking.staffName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-slate-200/80">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">5-Day Hold Expiry</span>
                  <p className="text-sm font-semibold text-amber-700">{formattedExpiry}</p>
                </div>
              </div>
            </div>

            {/* Interactive Confirmation Component */}
            <ConfirmBookingClient
              token={token}
              isConfirmedInitial={isConfirmed}
              isExpired={booking.isExpired}
              confirmedAt={booking.confirmedAt}
            />

            <div className="pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
              Need to modify this booking? Contact your account executive <strong>{booking.staffName}</strong> directly.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
