"use client";

import { useState, useTransition } from "react";
import { X, Calendar, User, Mail, Clock, Send, Loader2, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";
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
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [bookingPeriod, setBookingPeriod] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(
    currentUserId || (staffList.length > 0 ? staffList[0].id : "")
  );
  const [notes, setNotes] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const isFull = site.activeBookingsCount >= 3;
  const remainingSlots = Math.max(0, 3 - site.activeBookingsCount);

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

    setError(null);
    const formData = new FormData();
    formData.append("site_id", site.uuid || String(site.id));
    formData.append("client_name", clientName.trim());
    formData.append("client_email", clientEmail.trim());
    formData.append("booking_period", bookingPeriod.trim());
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
              Simultaneous Booking Hold (Slot {site.activeBookingsCount + 1} of 3)
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
                <p className="text-xs text-emerald-700">5-day reservation hold active &amp; confirmation email dispatched.</p>
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

              {/* Booking Period (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Booking Period <span className="text-gray-400 text-[10px] font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1st Sep - 15th Sep or 30 Days"
                  value={bookingPeriod}
                  onChange={e => setBookingPeriod(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
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

              {/* Hold Duration & Auto-Expiry Notice */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">5-Day Automatic Hold:</span> This booking will auto-unbook after <strong>5 days</strong> unless extended manually by staff from the dashboard.
                </div>
              </div>

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
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Book Site</span>
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
