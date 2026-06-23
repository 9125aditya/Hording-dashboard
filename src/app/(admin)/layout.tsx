import Link from "next/link";
import { LayoutDashboard, Map, Clock, LogOut } from "lucide-react";
import AdminMobileMenu from "@/components/AdminMobileMenu";
import { logout } from "@/lib/auth-actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Dark Sidebar */}
      <aside className="w-60 hidden md:flex flex-col" style={{ backgroundColor: '#1e2a3a' }}>
        <div className="px-5 py-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#3b82f6' }}>
              M
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight">Media Inv.</h1>
              <p className="text-xs" style={{ color: '#7a8ba3' }}>OOH Management</p>
            </div>
          </div>
        </div>

        <div className="px-3 mb-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#5a6b7f' }}>Main</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-white transition-colors" style={{ backgroundColor: '#2a3a4e' }}>
            <LayoutDashboard className="mr-3 h-4 w-4" style={{ color: '#60a5fa' }} />
            Dashboard
          </Link>
          <Link href="/inventory" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
            <Map className="mr-3 h-4 w-4" />
            Inventory
          </Link>
          <Link href="/attendance" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors hover:bg-white/5" style={{ color: '#8a9bb0' }}>
            <Clock className="mr-3 h-4 w-4" />
            Attendance
          </Link>
        </nav>

        <div className="p-3 mt-auto">
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
            <AdminMobileMenu />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs">
              AD
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
