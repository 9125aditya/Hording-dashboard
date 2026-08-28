import { ReactNode } from "react";
import Link from "next/link";

import PublicMobileMenu from "@/frontend/components/PublicMobileMenu";
import PublicUserNav from "@/frontend/components/PublicUserNav";
import AdminLogoutButton from "@/frontend/components/AdminLogoutButton";
import TabSessionManager from "@/frontend/components/TabSessionManager";
import { createClient } from "@/backend/db/server";

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }: { children: ReactNode }) {
  let user = null;
  let role = 'public';
  let userName = '';
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('name, role').eq('id', user.id).single();
      if (profile) {
        role = profile.role || 'public';
        userName = profile.name || user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0];
      } else {
        userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0];
      }
    }
  } catch (error) {
    console.error("Public Layout Supabase Error:", error);
  }

  const isAdmin = role === 'admin' || role === 'super_admin' || role === 'backoffice' || role === 'marketing' || role === 'execution_head';

  return (
    <div className="min-h-full flex flex-col bg-[#f4f8fb] text-slate-900 font-sans">
      <TabSessionManager />
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-[#f4f8fb] border-b border-slate-200/70 shadow-sm">
        <div className="container flex h-24 md:h-28 max-w-7xl items-center mx-auto px-4 sm:px-6 justify-between relative">
          {/* Logo - Centered and enlarged on mobile, left on desktop */}
          <div className="flex items-center justify-center flex-1 md:flex-initial">
            <Link href="/" className="flex items-center py-1">
              <img 
                src="/logo.png" 
                alt="TrueSign Media" 
                className="h-20 sm:h-24 md:h-24 lg:h-24 w-auto object-contain mix-blend-multiply" 
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-7 text-[13.5px] font-bold text-slate-700">
            <Link href="/catalog" className="hover:text-red-600 transition-colors">Catalogue</Link>
            <Link href="/services" className="hover:text-red-600 transition-colors">Services</Link>
            <Link href="/careers" className="hover:text-red-600 transition-colors">Careers</Link>
            <Link href="/contact" className="hover:text-red-600 transition-colors">Enquiry</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <a href="#" className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors bg-white shadow-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
              </a>
              <a href="#" className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:border-slate-300 transition-colors bg-white shadow-sm">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <Link href="/contact" className="h-10 px-5 rounded-full bg-[#fab935] text-slate-900 text-[14px] font-bold flex items-center justify-center hover:bg-[#f2a81d] transition-colors ml-1 shadow-sm">
                Get In Touch
              </Link>
              <PublicUserNav
                user={user ? { name: userName, role, email: user.email } : null}
                isAdmin={isAdmin}
              />
            </div>
            
            <div className="md:hidden absolute right-4">
              <PublicMobileMenu hasUser={!!user} isAdmin={isAdmin} userName={userName} role={role} />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#031e6c] text-white pt-10 md:pt-16 pb-8 border-t border-[#031d68]">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
            
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="inline-block mb-6 bg-white rounded-xl p-2 shadow-sm hover:opacity-95 transition-opacity">
                <img src="/logo.png" alt="Sellads Advertising" className="h-14 md:h-16 w-auto object-contain" />
              </Link>
              <p className="text-[13px] text-blue-100 leading-relaxed pr-4 font-medium opacity-90">
                Premium outdoor media inventory across Maharashtra. Hoardings, billboards, and brand campaigns that drive reach.
              </p>
              <div className="flex gap-3 pt-6">
                <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full border border-blue-400/30 flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/10 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-full border border-blue-400/30 flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/10 transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#fab935] text-slate-900 font-bold text-[14px] hover:bg-[#f2a81d] transition-all shadow-sm"
                    >
                      <span>Go to Dashboard</span>
                      <span className="text-[10px] bg-slate-900/15 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                        {userName || 'Staff'}
                      </span>
                    </Link>
                    <AdminLogoutButton
                      className="inline-flex items-center justify-center px-4 py-3 rounded-full border border-blue-400/40 text-blue-200 hover:bg-white/10 hover:text-white text-[13.5px] font-semibold transition-colors cursor-pointer"
                      showIcon={false}
                      label="Sign Out"
                    />
                  </>
                ) : (
                  <Link href="/login" className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#fab935] text-slate-900 font-bold text-[15px] hover:bg-[#f2a81d] transition-colors shadow-sm">
                    Admin Login
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-1">
              <h3 className="font-extrabold text-[#fab935] mb-6 uppercase tracking-wider text-[11px]">Quick Links</h3>
              <ul className="space-y-3.5 text-[13px] text-blue-100 font-medium opacity-90">
                <li><Link href="/" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Home</Link></li>
                <li><Link href="/catalog" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Inventory</Link></li>
                <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Enquiry</Link></li>
                <li><Link href="/services" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Services</Link></li>
                <li><Link href="/#clients" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Clients</Link></li>
                <li><Link href="/careers" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white hover:translate-x-1 inline-block transition-transform">Contact</Link></li>
              </ul>
            </div>

            {/* Offices */}
            <div className="md:col-span-2">
              <h3 className="font-extrabold text-[#fab935] mb-6 uppercase tracking-wider text-[15px]">Offices</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-blue-800/60 rounded-xl bg-[#021857] hover:bg-[#031d68] transition-colors cursor-default">
                  <h4 className="font-bold text-[15.5px] mb-1.5 text-white">Nagpur</h4>
                  <p className="text-[12.5px] text-blue-200/70 leading-relaxed font-medium">123, Bhagwaghar Layout, Dharampeth, Nagpur<br/>440010</p>
                </div>
              
               
               
              </div>
              <h3 className="font-extrabold text-[#fab935] mb-6 mt-8 uppercase tracking-wider text-[15px]">Contacts</h3>
              <div className="mt-5 text-[12.5px] text-blue-300 font-medium">
                <a href="mailto:truesignmedia@gmail.com" className="block mb-3 hover:text-white transition-colors">truesignmedia@gmail.com</a>
                
                <a href="tel:+919765556861" className="block mb-2 hover:text-white transition-colors">+91 9765556861</a>
                <a href="tel:+919765556859" className="block mb-3 hover:text-white transition-colors">+91 9765556859</a>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-blue-800/60 text-center">
            <p className="text-[11.5px] font-medium text-blue-300/60 uppercase tracking-wide">
              © {new Date().getFullYear()} TrueSign Media. All rights reserved. <Link href="/login" className="hover:text-white ml-2 opacity-50 hover:opacity-100 transition-opacity">Admin</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
