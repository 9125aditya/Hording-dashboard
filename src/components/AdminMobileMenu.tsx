"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PanelLeftClose, LayoutDashboard, Map, MessageSquare, Users, LogOut, X } from "lucide-react";
import { logout } from "@/lib/auth-actions";

export default function AdminMobileMenu() {
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
      <button onClick={() => setIsOpen(true)} className="md:hidden mr-4 text-muted-foreground hover:text-foreground" aria-label="Open sidebar">
        <PanelLeftClose className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200">
          <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-2xl flex flex-col animate-in slide-in-from-left-full duration-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="font-heading font-bold text-lg text-primary tracking-tight">
                OOH ADMIN
              </Link>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-muted-foreground hover:text-foreground bg-muted/50 rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 py-6 px-3 space-y-1">
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground">
                <LayoutDashboard className="mr-3 h-4 w-4" /> Overview
              </Link>
              <Link href="/inventory" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Map className="mr-3 h-4 w-4" /> Inventory
              </Link>
              <Link href="/enquiries" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <MessageSquare className="mr-3 h-4 w-4" /> Enquiries
              </Link>
              <Link href="/staff" onClick={() => setIsOpen(false)} className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                <Users className="mr-3 h-4 w-4" /> Staff
              </Link>
            </div>
            <div className="p-4 border-t border-border">
              <form action={logout}>
                <button type="submit" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground w-full transition-colors">
                  <LogOut className="mr-3 h-4 w-4" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
