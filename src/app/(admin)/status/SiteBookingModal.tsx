"use client";

import { useState, useTransition, useMemo } from "react";
import { X, Calendar, User, Mail, Clock, Send, Loader2, AlertCircle, CheckCircle2, ShieldAlert, ShieldCheck, Lock } from "lucide-react";
import { createSiteBooking, StaffOption } from "@/backend/actions/booking-actions";

export interface SiteBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: {
    id: number;
    uuid: string;
    name: string;
    city: string;
    area?: string;
    type?: string;
    size?: string;
    lit_type?: string;
    activeBookingsCount: number;
  };
  staffList: StaffOption[];
  currentUserId?: string;
  currentUserName?: string;
  onBookingSuccess: () => void;
}

export default function SiteBookingModal({
  isOpen,
  onClose,
  site,
  staffList,
  currentUserId,
  currentUserName,
  onBookingSuccess,
}: SiteBookingModalProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const defaultEndStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [bookingType, setBookingType] = useState<"BLOCKED" | "CONFIRMED">("BLOCKED");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);
  const [selectedStaffId, setSelectedStaffId] = useState(
    currentUserId || (staffList.length > 0 ? staffList[0].id : "")
  );
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Compute duration in days & formatted string
  const durationInfo = useMemo(() => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays <= 0) return { days: 0, text: "Invalid date range", valid: false };

    const startFormatted = start.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const endFormatted = end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    return {
      days: diffDays,
      text: `${startFormatted} – ${endFormatted} (${diffDays} Day${diffDays === 1 ? "" : "s"})`,
      valid: true,
    };
  }, [startDate, endDate]);

  if (!isOpen) return null;

  const isFull = site.activeBookingsCount >= 3;

  const selectedStaffObj = staffList.find(s => s.id === selectedStaffId);
  const staffName = selectedStaffObj?.name || currentUserName || "Staff Member";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) {
      setError("This site already has 3 active bookings. Maximum simultaneous capacity reached.");
      return;
    }

    if (!clientName.trim()) {
      setError("Please provide the Client Name.");
      return;
    }

    if (!clientEmail.trim() || !clientEmail.includes("@")) {
      setError("Please provide a valid Client Email for confirmation.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both Start Date and End Date from the calendar.");
      return;
    }

    if (durationInfo && !durationInfo.valid) {
      setError("End Date must be on or after Start Date.");
      return;
    }

    setError(null);
    const formData = new FormData();
    formData.append("site_id", site.uuid || String(site.id));
    formData.append("client_name", clientName.trim());
    formData.append("client_email", clientEmail.trim());
    formData.append("booking_type", bookingType);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("booking_period", durationInfo?.text || `${startDate} to ${endDate}`);
    formData.append("booked_by_staff_id", selectedStaffId);
    formData.append("booked_by_staff_name", staffName);
    formData.append("notes", notes.trim());
    formData.append("send_email", sendEmail ? "true" : "false");

    startTransition(async () => {
      const res = await createSiteBooking(formData);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          onBookingSuccess();
          onClose();
        }, 1500);
      } else {
        setError(res.error || "Failed to create booking.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Book Hoarding Site</h2>
            <p className="text-xs text-indigo-100 mt-0.5">
              Simultaneous Booking Slot ({site.activeBookingsCount + 1} of 3)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Site Header Summary */}
        <div className="bg-indigo-50/70 border-b border-indigo-100/80 px-6 py-3 flex items-center justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <p className="text-xs font-bold text-gray-900 truncate">{site.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{site.city}{site.area ? `, ${site.area}` : ""} · {site.type || "Billboard"}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              site.activeBookingsCount === 0 ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
              site.activeBookingsCount === 1 ? "bg-blue-100 text-blue-800 border-blue-200" :
              site.activeBookingsCount === 2 ? "bg-amber-100 text-amber-800 border-amber-200" :
              "bg-rose-100 text-rose-800 border-rose-200"
            }`}>
              {site.activeBookingsCount}/3 Active
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Booking Created Successfully!</p>
                <p className="text-xs text-emerald-700">
                  {bookingType === "BLOCKED"
                    ? "5-day temporary reservation hold active."
                    : "Confirmed booking recorded for the scheduled campaign period."}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isFull ? (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-rose-600 mx-auto" />
              <h4 className="text-sm font-bold text-rose-900">Capacity Limit Reached</h4>
              <p className="text-xs text-rose-700">
                This site already has 3 active simultaneous bookings. Please release or wait for an existing hold to expire before creating a new booking.
              </p>
            </div>
          ) : (
            <>
              {/* Booking Type Selector: Blocked (5-Day Rule) vs Confirmed */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Booking Classification <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setBookingType("BLOCKED")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bookingType === "BLOCKED"
                        ? "bg-white text-amber-700 shadow-xs border border-amber-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Blocked (5-Day Hold)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBookingType("CONFIRMED")}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      bookingType === "CONFIRMED"
                        ? "bg-white text-emerald-700 shadow-xs border border-emerald-200"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Confirmed Booking</span>
                  </button>
                </div>
              </div>

              {/* Client Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation / Rajesh Mehta"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Client Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" /> Client Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. client@company.com"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Booking Period with Calendar Date Pickers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Booking Period (Calendar Range) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="block text-[11px] font-semibold text-gray-500 mb-1">Start Date</span>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="block text-[11px] font-semibold text-gray-500 mb-1">End Date</span>
                    <input
                      type="date"
                      required
                      min={startDate}
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                    />
                  </div>
                </div>

                {/* Duration Summary Badge */}
                {durationInfo && durationInfo.valid && (
                  <div className="mt-1 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-900">Selected Schedule:</span>
                    <span className="font-bold text-indigo-700">{durationInfo.text}</span>
                  </div>
                )}
              </div>

              {/* Booked by Staff Member */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Booked By Staff <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedStaffId}
                  onChange={e => setSelectedStaffId(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                >
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name} {staff.role ? `(${staff.role})` : ""}
                    </option>
                  ))}
                  {staffList.length === 0 && (
                    <option value={currentUserId || "staff"}>{currentUserName || "Current Staff"}</option>
                  )}
                </select>
              </div>

              {/* 5-Day Rule / Confirmation Policy Box */}
              {bookingType === "BLOCKED" ? (
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900">
                    <span className="font-bold">5-Day Automatic Hold Rule:</span> This blocked reservation will automatically release after <strong>5 days</strong> unless extended manually or converted into a confirmed booking.
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-900">
                    <span className="font-bold">Confirmed Booking:</span> This site is locked for the entire scheduled calendar duration until <strong>{endDate}</strong>. No 5-day expiration applies.
                  </div>
                </div>
              )}

              {/* Automated Confirmation Email Checkbox */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Automated Confirmation Email</p>
                    <p className="text-[11px] text-gray-500">Send confirmation request &amp; site summary to client</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={sendEmail}
                  onChange={e => setSendEmail(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Additional Internal Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Internal Notes <span className="text-gray-400 text-[10px] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Special instructions, rate agreed, or client references..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                />
              </div>
            </>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {!isFull && (
              <button
                type="submit"
                disabled={isPending || success}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{bookingType === "BLOCKED" ? "Block Site (5-Day Hold)" : "Confirm & Book Site"}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
