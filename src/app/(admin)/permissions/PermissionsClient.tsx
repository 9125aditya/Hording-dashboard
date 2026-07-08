"use client";

import { useState, useTransition } from "react";
import { Shield, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { updateUserPermissions } from "@/backend/actions/admin-actions";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
};

const AVAILABLE_PERMISSIONS = [
  { id: 'add_users', label: 'Add/Manage Users', desc: 'Can add new users to the system' },
  { id: 'change_site_photos', label: 'Change Site Photos', desc: 'Can upload or remove photos for existing sites' },
  { id: 'make_quotations', label: 'Make Quotations', desc: 'Can generate quotes and proposals' },
  { id: 'edit_site_price', label: 'Edit Site Price', desc: 'Can modify the pricing of sites' },
  { id: 'edit_site_details', label: 'Edit Site Details', desc: 'Can modify base site info, status, and delete sites' },
];

export default function PermissionsClient({ profiles }: { profiles: Profile[] }) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const openModal = (profile: Profile) => {
    setSelectedProfile(profile);
    setActivePermissions(profile.permissions || []);
    setError(null);
  };

  const togglePermission = (permId: string) => {
    setActivePermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleSave = () => {
    if (!selectedProfile) return;
    setError(null);
    
    startTransition(async () => {
      const res = await updateUserPermissions(selectedProfile.id, activePermissions);
      if (res?.success) {
        setSelectedProfile(null);
      } else {
        setError(res?.error || "Failed to update permissions.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Granted Permissions</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {profiles.map(profile => {
              const isSuperAdmin = profile.role === 'super_admin';
              const perms = profile.permissions || [];
              
              return (
                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-gray-500 text-xs">{profile.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                      isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {profile.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isSuperAdmin ? (
                      <span className="text-xs text-purple-600 font-medium flex items-center">
                        <ShieldCheck className="w-3 h-3 mr-1" /> All Access
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {perms.length === 0 ? (
                          <span className="text-gray-400 text-xs">No explicit rights</span>
                        ) : (
                          perms.map(p => {
                            const found = AVAILABLE_PERMISSIONS.find(ap => ap.id === p);
                            return (
                              <span key={p} className="px-2 py-0.5 bg-gray-100 border text-gray-600 rounded text-[10px] uppercase font-semibold whitespace-nowrap">
                                {found ? found.label : p}
                              </span>
                            );
                          })
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openModal(profile)}
                      disabled={isSuperAdmin}
                      className="text-primary font-medium text-sm hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Manage Rights
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg border shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Manage Rights for {selectedProfile.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{selectedProfile.email}</p>
            </div>
            
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {AVAILABLE_PERMISSIONS.map(perm => {
                const isActive = activePermissions.includes(perm.id);
                return (
                  <label key={perm.id} className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center h-5 mt-0.5">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        checked={isActive}
                        onChange={() => togglePermission(perm.id)}
                      />
                    </div>
                    <div className="ml-3">
                      <span className={`block text-sm font-semibold ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {perm.label}
                      </span>
                      <span className="block text-xs text-gray-500 mt-0.5">{perm.desc}</span>
                    </div>
                  </label>
                );
              })}
              
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
