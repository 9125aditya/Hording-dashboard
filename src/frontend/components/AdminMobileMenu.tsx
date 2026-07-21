"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Map, MessageSquare, LogOut, X, Menu, ExternalLink, CheckCircle, Shield, Users, MapPin, Package } from "lucide-react";
import { logout } from "@/backend/actions/auth-actions";

export default function AdminMobileMenu({ isSuperAdmin = false }: { isSuperAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinkClass = "flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700";

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden mr-4 text-gray-500 hover:text-gray-900" aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div
            className="absolute inset-y-0 left-0 w-[260px] flex flex-col bg-white shadow-2xl animate-in slide-in-from-left-full duration-300"
          >
            <div className="px-5 py-5 flex items-center justify-between border-b border-gray-100">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-3 space-y-0.5">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <LayoutDashboard className="mr-3 h-[18px] w-[18px]" /> Dashboard
              </Link>
              <Link href="/inventory" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <MapPin className="mr-3 h-[18px] w-[18px]" /> Inventory
              </Link>
              <Link href="/status" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <CheckCircle className="mr-3 h-[18px] w-[18px]" /> Update Status
              </Link>

              <Link href="/flex-inventory" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <Package className="mr-3 h-[18px] w-[18px]" /> Flex Inventory
              </Link>
              <Link href="/admin-map" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <Map className="mr-3 h-[18px] w-[18px]" /> Map View
              </Link>
              <Link href="/enquiries" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <MessageSquare className="mr-3 h-[18px] w-[18px]" /> Enquiries
              </Link>
              {isSuperAdmin && (
                <>
                  <Link href="/approvals" onClick={() => setIsOpen(false)} className={navLinkClass}>
                    <CheckCircle className="mr-3 h-[18px] w-[18px]" /> Action History
                  </Link>
                  <Link href="/permissions" onClick={() => setIsOpen(false)} className={navLinkClass}>
                    <Shield className="mr-3 h-[18px] w-[18px]" /> Access Control
                  </Link>

                </>
              )}
            </nav>

            <div className="px-3 mb-2">
              <Link href="/" target="_blank" onClick={() => setIsOpen(false)} className={navLinkClass}>
                <ExternalLink className="mr-3 h-[18px] w-[18px]" /> View Live Site
              </Link>
            </div>

            <div className="p-3 border-t border-gray-100">
              <form action={logout}>
                <button type="submit" className="flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg w-full text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
                  <LogOut className="mr-3 h-[18px] w-[18px]" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
