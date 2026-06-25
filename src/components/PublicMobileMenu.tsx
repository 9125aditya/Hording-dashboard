"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function PublicMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
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
    <div className="md:hidden flex items-center">
      <button onClick={() => setIsOpen(true)} className="p-2 -mr-2 text-foreground" aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div 
            className="absolute inset-y-0 right-0 w-[80vw] max-w-sm bg-white border-l border-border shadow-2xl p-6 flex flex-col animate-in slide-in-from-right-full duration-300 opacity-100"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-heading font-bold text-xl text-primary">OUTREACH OOH</span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-slate-900 bg-slate-100 rounded-full hover:bg-slate-200" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-6 text-lg font-medium relative z-10 text-slate-900">
              <Link href="/catalog" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary border-b border-slate-200 pb-4">Catalog</Link>
              <Link href="/map" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary border-b border-slate-200 pb-4">Map Search</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary border-b border-slate-200 pb-4">Contact</Link>
            </nav>
            <div className="mt-auto pt-6 flex flex-col gap-4 relative z-10">
              <Link href="/contact" onClick={() => setIsOpen(false)} className="flex h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contact for rates
              </Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="flex h-12 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors bg-white">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
