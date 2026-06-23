import { ReactNode } from "react";
import Link from "next/link";
import PublicMobileMenu from "@/components/PublicMobileMenu";

export default function PublicLayout({ children }: { children: ReactNode }) {
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
             <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Client Login
            </Link>
             <Link href="/admin/login" className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Admin Login
            </Link>
            <PublicMobileMenu />
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
              <div className="flex gap-4 pt-2">
                {/* Social icons placeholders */}
                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  f
                </a>
                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  in
                </a>
                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  ig
                </a>
                <a href="#" className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
                  x
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
