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
              <Link href="/services" onClick={() => setIsOpen(false)} className={linkClass}>
                <MegaphoneIcon className="h-4 w-4 text-slate-400 shrink-0" /> Our Services
              </Link>
              <Link href="/catalog" onClick={() => setIsOpen(false)} className={linkClass}>
                <Squares2X2Icon className="h-4 w-4 text-slate-400 shrink-0" /> Catalogue
              </Link>
              <Link href="/careers" onClick={() => setIsOpen(false)} className={linkClass}>
                <BriefcaseIcon className="h-4 w-4 text-slate-400 shrink-0" /> Careers
              </Link>
            </nav>

            {/* Bottom CTA & Socials */}
            <div className="px-4 py-4 border-t border-slate-100 space-y-3">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center w-full h-12 rounded-full bg-[#fab935] text-slate-900 text-[14px] font-bold hover:bg-[#f2a81d] transition-colors shadow-sm"
              >
                Get In Touch
              </Link>
              
              <div className="flex items-center justify-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com/selladsindia?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-pink-600 hover:border-pink-300 transition-colors bg-slate-50"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
                </a>
                <a
                  href="https://www.linkedin.com/company/selladsoutdooradvertisingagency"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#0077b5] hover:border-blue-300 transition-colors bg-slate-50"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>

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
