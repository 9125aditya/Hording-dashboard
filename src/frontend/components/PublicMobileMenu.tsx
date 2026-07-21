"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LayoutGrid, MessageSquare, Users, Briefcase, Home, LayoutDashboard, LogOut } from "lucide-react";
import { logout } from "@/backend/actions/auth-actions";

export default function PublicMobileMenu({ hasUser, isAdmin = false }: { hasUser?: boolean, isAdmin?: boolean }) {
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
        <Menu className="h-6 w-6" />
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
              <img src="/logo.png" alt="Sellads Advertising" className="h-9 w-auto object-contain" />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-500 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              <Link href="/" onClick={() => setIsOpen(false)} className={linkClass}>
                <Home className="h-4 w-4 text-slate-400 shrink-0" /> Home
              </Link>
              <Link href="/catalog" onClick={() => setIsOpen(false)} className={linkClass}>
                <LayoutGrid className="h-4 w-4 text-slate-400 shrink-0" /> Inventory
              </Link>
              <Link href="/#services" onClick={() => setIsOpen(false)} className={linkClass}>
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" /> Services
              </Link>
              <Link href="/#clients" onClick={() => setIsOpen(false)} className={linkClass}>
                <Users className="h-4 w-4 text-slate-400 shrink-0" /> Clients
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className={linkClass}>
                <MessageSquare className="h-4 w-4 text-slate-400 shrink-0" /> Enquiry
              </Link>
              <Link href="/careers" onClick={() => setIsOpen(false)} className={linkClass}>
                <Briefcase className="h-4 w-4 text-slate-400 shrink-0" /> Careers
              </Link>
            </nav>

            {/* Bottom CTA */}
            <div className="px-4 py-4 border-t border-slate-100 space-y-2">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full h-12 rounded-full bg-[#fab935] text-slate-900 text-[14px] font-bold hover:bg-[#f2a81d] transition-colors shadow-sm"
              >
                Contact for rates
              </Link>
              {hasUser ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  )}
                  <form action={logout}>
                    <button
                      type="submit"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-full border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full h-11 rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
