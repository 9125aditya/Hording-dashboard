import Link from "next/link";
import { LayoutDashboard, Map, MessageSquare, Users, LogOut, ExternalLink, CheckCircle, Shield, MapPin, LayoutGrid, Package, FileSpreadsheet } from "lucide-react";
import AdminMobileMenu from "@/frontend/components/AdminMobileMenu";
import ActiveLink from "@/frontend/components/ActiveLink";
import AdminLogoutButton from "@/frontend/components/AdminLogoutButton";
import TabSessionManager from "@/frontend/components/TabSessionManager";
import { logout } from "@/backend/actions/auth-actions";
import { createClient } from "@/backend/db/server";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let user = null;
  let role = 'public';
  let profileName = '';
  let enquiryCount = 0;
  let totalEnquiryCount = 0;
  let pendingCount = 0;

  try {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    user = authData?.user || null;

    if (user) {
      const [profileRes, eCountRes, totalECountRes, pCountRes] = await Promise.all([
        supabase.from('profiles').select('name, role').eq('id', user.id).single(),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('enquiries').select('*', { count: 'exact', head: true }),
        supabase.from('admin_requests').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
      ]);

      if (profileRes.data) {
        role = profileRes.data.role;
        profileName = profileRes.data.name;
      }
      enquiryCount = eCountRes.count || 0;
      totalEnquiryCount = totalECountRes.count || 0;
      pendingCount = pCountRes.count || 0;
    }
  } catch (error) {
    console.error("Admin Layout Supabase Error:", error);
  }

  const isSuperAdmin = role === 'super_admin';
  const userName = profileName || user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userInitial = (userName[0] || user?.email?.[0] || 'A').toUpperCase();
  const avatarBase64 = user?.user_metadata?.avatar_base64 || null;

  return (
    <div className="min-h-full flex w-full bg-gray-50/80">
      <TabSessionManager />
      {/* Light Sidebar */}
      <aside className="w-[220px] hidden md:flex flex-col bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-40">
        <div className="px-5 pt-6 pb-5">
          <Link href="/dashboard" className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-9 w-auto object-contain mix-blend-multiply" />
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-0.5">
          <ActiveLink href="/dashboard">
            <LayoutDashboard className="mr-3 h-[18px] w-[18px]" />
            Dashboard
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

          <ActiveLink href="/inventory">
            <LayoutGrid className="mr-3 h-[18px] w-[18px]" />
            Inventory
          </ActiveLink>

          <ActiveLink href="/enquiries">
            <MessageSquare className="mr-3 h-[18px] w-[18px]" />
            Enquiries
            {enquiryCount > 0 && (
              <span className="ml-auto text-[10px] font-bold bg-indigo-600 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                {enquiryCount} new
              </span>
            )}
          </ActiveLink>

          <ActiveLink href="/quotations">
            <FileSpreadsheet className="mr-3 h-[18px] w-[18px]" />
            Quotation Builder
          </ActiveLink>
          {isSuperAdmin && (
            <>
              <ActiveLink href="/approvals">
                <CheckCircle className="mr-3 h-[18px] w-[18px]" />
                Action History
                {pendingCount > 0 && (
                  <span className="ml-auto text-[10px] font-bold bg-amber-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                    {pendingCount}
                  </span>
                )}
              </ActiveLink>
              <ActiveLink href="/permissions">
                <Shield className="mr-3 h-[18px] w-[18px]" />
                Permissions
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
            <AdminLogoutButton />
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
            <AdminMobileMenu isSuperAdmin={isSuperAdmin} enquiryCount={enquiryCount} totalEnquiryCount={totalEnquiryCount} pendingCount={pendingCount} />
          </div>
          <div className="flex items-center gap-3">
            {enquiryCount > 0 && (
              <Link
                href="/enquiries"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-xs animate-in fade-in"
                title={`${enquiryCount} New Unhandled Enquiries`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>
                  <span className="font-bold">{enquiryCount}</span> {enquiryCount === 1 ? 'New Enquiry' : 'New Enquiries'}
                </span>
              </Link>
            )}
            {/* User Profile Pill Badge */}
            <Link 
              href="/profile" 
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all group shadow-2xs"
            >
              {avatarBase64 ? (
                <img src={avatarBase64} alt="Avatar" className="h-8 w-8 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {userInitial}
                </div>
              )}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors whitespace-nowrap leading-tight">
                  {userName}
                </span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5 whitespace-nowrap">
                  {role.replace('_', ' ')}
                </span>
              </div>
            </Link>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            <AdminLogoutButton
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all border border-slate-200 bg-white shadow-2xs cursor-pointer"
              iconClassName="h-3.5 w-3.5"
              label="Sign Out"
            />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
