import { createClient } from "@/backend/db/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  let profile = null;
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (data) profile = data;

  const initialData = {
    name: profile?.name || user.user_metadata?.full_name || '',
    email: user.email || '',
    role: profile?.role || 'public',
  };

  return (
    <div className="space-y-6 max-w-[800px] mx-auto pb-20">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and personal information.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}
