"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Map, Clock, LogOut, X, Menu } from "lucide-react";
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

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="md:hidden mr-4 text-gray-500 hover:text-gray-900" aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div
            className="absolute inset-y-0 left-0 w-64 flex flex-col animate-in slide-in-from-left-full duration-300"
            style={{ backgroundColor: '#1e2a3a' }}
          >
            <div className="px-5 py-6 flex items-center justify-between">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="font-heading font-bold text-xl tracking-tight text-white">
                OOH
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-3 mb-2">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a6b7f' }}>Main</p>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5" style={{ color: '#8a9bb0' }}>
                <LayoutDashboard className="mr-3 h-4 w-4" /> Dashboard
              </Link>
              <Link href="/inventory" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5" style={{ color: '#8a9bb0' }}>
                <Map className="mr-3 h-4 w-4" /> Inventory
              </Link>
              <Link href="/enquiries" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5" style={{ color: '#8a9bb0' }}>
                <Clock className="mr-3 h-4 w-4" /> Enquiries
              </Link>
              {isSuperAdmin && (
                <Link href="/staff" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-white/5" style={{ color: '#8a9bb0' }}>
                  <Clock className="mr-3 h-4 w-4" /> Staff
                </Link>
              )}
            </nav>

            <div className="p-3 mt-auto">
              <form action={logout}>
                <button type="submit" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full hover:bg-white/5" style={{ color: '#8a9bb0' }}>
                  <LogOut className="mr-3 h-4 w-4" /> Sign Out
                </button>
              </form>
            </div>

            <div className="px-5 pb-4">
              <p className="text-xs" style={{ color: '#5a6b7f' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
