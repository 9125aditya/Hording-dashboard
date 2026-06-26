import Link from "next/link";
import { LayoutDashboard, Map, MessageSquare, Users, LogOut, ExternalLink } from "lucide-react";
import AdminMobileMenu from "@/frontend/components/AdminMobileMenu";
import { logout } from "@/backend/actions/auth-actions";
import { createClient } from "@/backend/db/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  let role = 'public';
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
    
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile) role = profile.role;
    }
  } catch (error) {
    console.error("Admin Layout Supabase Error:", error);
    // Ignore error, render with default values
  }

  const isSuperAdmin = role === 'super_admin';
  return (
    <div className="admin-theme min-h-full flex w-full" style={{ backgroundColor: 'var(--background)' }}>
      {/* Dark Sidebar */}
      <aside className="w-60 hidden md:flex flex-col" style={{ backgroundColor: '#1e2a3a' }}>
        <div className="px-5 py-6">
          <Link href="/dashboard" className="font-heading font-bold text-xl tracking-tight text-white">
            OOH
          </Link>
        </div>

        <div className="px-3 mb-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a6b7f' }}>Main</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
            <LayoutDashboard className="mr-3 h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/inventory" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
            <Map className="mr-3 h-4 w-4" />
            Inventory
          </Link>
          <Link href="/enquiries" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
            <MessageSquare className="mr-3 h-4 w-4" />
            Enquiries
          </Link>
          {isSuperAdmin && (
            <Link href="/staff" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
              <Users className="mr-3 h-4 w-4" />
              Staff
            </Link>
          )}
        </nav>

        <div className="px-3 mt-4 mb-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a6b7f' }}>Public</p>
        </div>
        <nav className="px-3 mb-auto">
          <Link href="/" target="_blank" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
            <ExternalLink className="mr-3 h-4 w-4" />
            View Live Site
          </Link>
        </nav>

        <div className="p-3 mt-4">
          <form action={logout}>
            <button type="submit" className="flex items-center px-3 py-2 text-sm font-medium rounded-lg w-full transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>

        {/* Date at bottom */}
        <div className="px-5 pb-4">
          <p className="text-xs" style={{ color: '#5a6b7f' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <AdminMobileMenu isSuperAdmin={isSuperAdmin} />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-2">
              <span className="text-sm font-medium leading-none">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
              <span className="text-[10px] uppercase text-muted-foreground mt-1 tracking-wider">{role.replace('_', ' ')}</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs uppercase">
              {(user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A')}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
