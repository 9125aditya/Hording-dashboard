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
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-full max-w-[80vw] bg-background border-l border-border shadow-2xl p-6 flex flex-col animate-in slide-in-from-right-full duration-300">
            <div className="flex items-center justify-between mb-8">
              <span className="font-heading font-bold text-xl text-primary">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-foreground bg-muted/50 rounded-full hover:bg-muted" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col space-y-6 text-lg font-medium">
              <Link href="/catalog" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary border-b border-border/50 pb-4">Catalog</Link>
              <Link href="/map" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary border-b border-border/50 pb-4">Map Search</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="transition-colors hover:text-primary border-b border-border/50 pb-4">Contact</Link>
            </nav>
            <div className="mt-auto pt-6 flex flex-col gap-4">
              <Link href="/contact" onClick={() => setIsOpen(false)} className="flex h-12 items-center justify-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Contact for rates
              </Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="flex h-12 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
