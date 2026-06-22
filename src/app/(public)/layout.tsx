import { ReactNode } from "react";
import Link from "next/link";
import PublicMobileMenu from "@/components/PublicMobileMenu";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center mx-auto px-4 justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="font-heading font-bold text-xl tracking-tight text-primary">
              OOH MEDIA
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
      <footer className="border-t border-border py-8 bg-card mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row mx-auto px-4 text-sm text-muted-foreground">
          <p className="font-heading font-semibold text-foreground">OOH MEDIA PLATFORM</p>
          <p>© {new Date().getFullYear()} All rights reserved. | <Link href="/admin/login" className="hover:text-foreground hover:underline ml-1">Admin Login</Link></p>
        </div>
      </footer>
    </div>
  );
}
