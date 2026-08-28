"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bars3Icon, XMarkIcon, Squares2X2Icon, BriefcaseIcon, HomeIcon, ArrowRightOnRectangleIcon, MegaphoneIcon } from "@heroicons/react/24/outline";
import { logout } from "@/backend/actions/auth-actions";
import { clearTabSession } from "@/frontend/components/TabSessionManager";

export default function PublicMobileMenu({
  hasUser,
  isAdmin = false,
  userName,
  role
}: {
  hasUser?: boolean;
  isAdmin?: boolean;
  userName?: string;
  role?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const linkClass = "flex items-center gap-3 px-3 py-3.5 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors";

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-1 text-slate-700 hover:text-slate-900 transition-colors"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer — slides from right, fully opaque white */}
          <div className="absolute inset-y-0 right-0 w-[80vw] max-w-[320px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <img src="/logo.png" alt="TrueSign Media" className="h-14 w-auto object-contain mix-blend-multiply" />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Logged in User Banner */}
            {hasUser && (
              <div className="mx-3 mt-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                  {(userName || 'A')[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-900 truncate">{userName || 'Staff'}</p>
                  <p className="text-[11px] text-slate-500 font-medium capitalize">
                    {role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : role?.replace('_', ' ') || 'Staff'}
                  </p>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)} className={linkClass}>
                <HomeIcon className="h-4 w-4 text-slate-400 shrink-0" /> Home
              </Link>
              <Link href="/catalog" onClick={() => setIsOpen(false)} className={linkClass}>
                <Squares2X2Icon className="h-4 w-4 text-slate-400 shrink-0" /> Catalogue
              </Link>
              <Link href="/services" onClick={() => setIsOpen(false)} className={linkClass}>
                <MegaphoneIcon className="h-4 w-4 text-slate-400 shrink-0" /> Services
              </Link>
              <Link href="/careers" onClick={() => setIsOpen(false)} className={linkClass}>
                <BriefcaseIcon className="h-4 w-4 text-slate-400 shrink-0" /> Careers
              </Link>
            </nav>

            {/* Bottom CTA */}
            <div className="px-4 py-4 border-t border-slate-100 space-y-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full h-12 rounded-full bg-[#fab935] text-slate-900 text-[14px] font-bold hover:bg-[#f2a81d] transition-colors shadow-sm"
              >
                Get In Touch
              </Link>
              {hasUser && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full h-11 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Squares2X2Icon className="h-4 w-4" /> Go to Dashboard
                  </Link>
                  <form action={logout} onSubmit={() => clearTabSession()}>
                    <button
                      type="submit"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" /> Sign Out
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
