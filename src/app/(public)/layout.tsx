import { ReactNode } from "react";
import Link from "next/link";
import PublicMobileMenu from "@/components/PublicMobileMenu";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-heading font-bold text-xl tracking-tight text-primary flex items-center gap-2">
              OUTREACH OOH
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="/catalog" className="transition-colors hover:text-foreground/80 text-foreground/60">Catalog</Link>
              <Link href="/map" className="transition-colors hover:text-foreground/80 text-foreground/60">Map Search</Link>
              <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">Contact</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/contact" className="hidden sm:inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Contact for rates
            </Link>
            {user ? (
               <Link href="/dashboard" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
               </Link>
            ) : (
               <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Login / Sign Up
               </Link>
            )}
            <PublicMobileMenu hasUser={!!user} />
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="border-t border-border py-12 bg-card mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="font-heading font-bold text-2xl tracking-tight text-primary flex items-center gap-2 mb-4">
                OUTREACH OOH
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium outdoor media inventory across Maharashtra. Hoardings, billboards, and brand campaigns that drive reach.
              </p>
              <div className="flex gap-3 pt-2">
                <a href="#" aria-label="Facebook" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
                </a>
                <a href="#" aria-label="X (Twitter)" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1">
              <h3 className="font-heading font-semibold text-primary mb-4 uppercase tracking-wider text-xs">Quick Links</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
                <li><Link href="/catalog" className="hover:text-foreground transition-colors">Inventory</Link></li>
                <li><Link href="/map" className="hover:text-foreground transition-colors">Services</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Clients</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Offices */}
            <div className="md:col-span-2">
              <h3 className="font-heading font-semibold text-primary mb-4 uppercase tracking-wider text-xs">Offices</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-border rounded-xl bg-background/50">
                  <h4 className="font-semibold text-sm mb-1 text-foreground">Nagpur</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">12, Sitabuldi Main Road, Nagpur 440012</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-background/50">
                  <h4 className="font-semibold text-sm mb-1 text-foreground">Amravati</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">4, Rajapeth Market, Amravati 444601</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-background/50">
                  <h4 className="font-semibold text-sm mb-1 text-foreground">Chandrapur</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Super Market Complex, Chandrapur 442401</p>
                </div>
                <div className="p-4 border border-border rounded-xl bg-background/50">
                  <h4 className="font-semibold text-sm mb-1 text-foreground">Pune</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">Phase 1, Hinjewadi, Pune 411057</p>
                </div>
              </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border gap-4">
            <div className="text-sm text-muted-foreground flex gap-2 items-center">
              <a href="mailto:hello@outreachooh.in" className="hover:text-foreground transition-colors">hello@outreachooh.in</a>
              <span>•</span>
              <a href="tel:+919000000000" className="hover:text-foreground transition-colors">+91 90000 00000</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Outreach OOH Media. All rights reserved. | <Link href="/admin/login" className="hover:text-foreground hover:underline ml-1">Admin</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
