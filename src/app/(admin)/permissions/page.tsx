import { ShieldAlert } from "lucide-react";
import { createClient } from "@/backend/db/server";
import Link from "next/link";
import PermissionsClient from "./PermissionsClient";

export default async function PermissionsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'super_admin') {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShieldAlert className="h-16 w-16 text-destructive mb-4 opacity-80" />
          <h2 className="text-2xl font-bold tracking-tight mb-2">Access Restricted</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            You do not have permission to view or manage access control. This section is restricted to Super Administrators.
          </p>
          <Link href="/dashboard" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Return to Dashboard
          </Link>
        </div>
      );
    }
  }

  // Fetch all profiles
  const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-heading">Access Control</h1>
          <p className="text-sm text-muted-foreground">Manage granular permissions and user rights.</p>
        </div>
      </div>
      <PermissionsClient profiles={profiles || []} />
    </div>
  );
}
