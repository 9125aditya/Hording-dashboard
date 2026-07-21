import Link from "next/link";
import { LayoutDashboard, Map, MessageSquare, Users, LogOut, ExternalLink, CheckCircle, Shield, MapPin, LayoutGrid, Package } from "lucide-react";
import AdminMobileMenu from "@/frontend/components/AdminMobileMenu";
import ActiveLink from "@/frontend/components/ActiveLink";
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
  }

  const isSuperAdmin = role === 'super_admin';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = (user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'A').toUpperCase();
  const avatarBase64 = user?.user_metadata?.avatar_base64 || null;

  return (
    <div className="min-h-full flex w-full bg-gray-50/80">
      {/* Light Sidebar */}
      <aside className="w-[220px] hidden md:flex flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40">
        <div className="px-5 pt-6 pb-5">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          <ActiveLink href="/dashboard">
            <LayoutDashboard className="mr-3 h-[18px] w-[18px]" />
            Dashboard
          </ActiveLink>
          <ActiveLink href="/inventory">
            <LayoutGrid className="mr-3 h-[18px] w-[18px]" />
            Inventory
          </ActiveLink>
          <ActiveLink href="/status">
            <CheckCircle className="mr-3 h-[18px] w-[18px]" />
            Update Status
          </ActiveLink>

          <ActiveLink href="/flex-inventory">
            <Package className="mr-3 h-[18px] w-[18px]" />
            Flex Inventory
          </ActiveLink>
          <ActiveLink href="/admin-map">
            <Map className="mr-3 h-[18px] w-[18px]" />
            Map View
          </ActiveLink>
          <ActiveLink href="/enquiries">
            <MessageSquare className="mr-3 h-[18px] w-[18px]" />
            Enquiries
          </ActiveLink>
          {isSuperAdmin && (
            <>
              <ActiveLink href="/approvals">
                <CheckCircle className="mr-3 h-[18px] w-[18px]" />
                Action History
              </ActiveLink>
              <ActiveLink href="/permissions">
                <Shield className="mr-3 h-[18px] w-[18px]" />
                Access Control
              </ActiveLink>

            </>
          )}
        </nav>

        <div className="px-3 mb-2">
          <Link href="/" target="_blank" className="flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg transition-all duration-200 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700">
            <ExternalLink className="mr-3 h-[18px] w-[18px]" />
            View Live Site
          </Link>
        </div>

        <div className="px-3 mb-2">
          <form action={logout}>
            <button type="submit" className="flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg w-full transition-all duration-200 text-slate-500 hover:bg-red-50 hover:text-red-600">
              <LogOut className="mr-3 h-[18px] w-[18px]" />
              Sign Out
            </button>
          </form>
        </div>

        {/* User Profile at bottom */}
        <div className="px-4 py-4 border-t border-gray-100 mt-auto hover:bg-gray-50 transition-colors">
          <Link href="/profile" className="flex items-center gap-3">
            {avatarBase64 ? (
              <img src={avatarBase64} alt="Avatar" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                {userInitial}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors">{userName}</p>
              <p className="text-[11px] text-gray-500 capitalize">{role.replace('_', ' ')}</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[220px]">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <AdminMobileMenu isSuperAdmin={isSuperAdmin} />
          </div>
          <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-sm font-semibold text-gray-900 leading-none">{userName}</span>
              <span className="text-[10px] uppercase text-gray-500 mt-1 tracking-wider font-medium">{role.replace('_', ' ')}</span>
            </div>
            {avatarBase64 ? (
              <img src={avatarBase64} alt="Avatar" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                {userInitial}
              </div>
            )}
          </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
