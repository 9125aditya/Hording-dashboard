import Link from "next/link";
import { LayoutDashboard, Map, MessageSquare, Users, LogOut, PanelLeftClose } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/dashboard" className="font-heading font-bold text-lg text-primary tracking-tight">
            OOH ADMIN
          </Link>
        </div>
        <div className="flex-1 py-6 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md bg-secondary text-secondary-foreground">
            <LayoutDashboard className="mr-3 h-4 w-4" />
            Overview
          </Link>
          <Link href="/inventory" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Map className="mr-3 h-4 w-4" />
            Inventory
          </Link>
          <Link href="/enquiries" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <MessageSquare className="mr-3 h-4 w-4" />
            Enquiries
          </Link>
          <Link href="/staff" className="flex items-center px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            <Users className="mr-3 h-4 w-4" />
            Staff
          </Link>
        </div>
        <div className="p-4 border-t border-border">
          <button className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground w-full transition-colors">
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-6 justify-between sticky top-0 z-30">
          <div className="flex items-center">
            <button className="md:hidden mr-4 text-muted-foreground">
              <PanelLeftClose className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
              AD
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
