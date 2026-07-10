"use client";

import { useState, useTransition } from "react";
import { User, Mail, Shield, Save, Loader2 } from "lucide-react";
import { updateProfile } from "@/backend/actions/auth-actions";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function ProfileForm({ initialData }: { initialData: { name: string; email: string; role: string; avatarBase64?: string } }) {
  const [name, setName] = useState(initialData.name);
  const [avatarBase64, setAvatarBase64] = useState(initialData.avatarBase64 || '');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleSave = () => {
    setMessage(null);
    if (!name.trim()) {
      setMessage({ type: 'error', text: "Name cannot be empty." });
      return;
    }
    
    startTransition(async () => {
      const res = await updateProfile(name, avatarBase64);
      if (res?.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: "Profile updated successfully." });
        router.refresh();
      }
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      setMessage({ type: 'error', text: "Image is too large. Please select an image under 1MB." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarBase64(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const userInitial = name[0]?.toUpperCase() || 'U';

  return (
    <div>
      {/* Header section with Avatar */}
      <div className="bg-indigo-50/50 p-8 flex flex-col sm:flex-row items-center gap-6 border-b border-gray-100">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          {avatarBase64 ? (
            <img src={avatarBase64} alt="Avatar" className="h-24 w-24 rounded-full object-cover shadow-sm ring-4 ring-white" />
          ) : (
            <div className="h-24 w-24 rounded-full bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold shadow-sm ring-4 ring-white">
              {userInitial}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-semibold">Change</span>
          </div>
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900">{initialData.name || 'User'}</h2>
          <p className="text-sm text-gray-500 mt-1">{initialData.email}</p>
          <span className="inline-flex items-center mt-3 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700">
            {initialData.role.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {message.text}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" /> Full Name
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-400" /> Email Address (Read-only)
            </label>
            <input 
              type="email" 
              value={initialData.email}
              readOnly
              className="w-full h-11 px-4 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-400" /> Role (Read-only)
            </label>
            <input 
              type="text" 
              value={initialData.role.replace('_', ' ').toUpperCase()}
              readOnly
              className="w-full h-11 px-4 rounded-lg border border-gray-100 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-2">Only Super Admins can change user roles in Access Control.</p>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-gray-100">
          <button
            onClick={handleSave}
            disabled={isPending || (name === initialData.name && avatarBase64 === initialData.avatarBase64)}
            className="inline-flex items-center justify-center h-10 px-6 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
