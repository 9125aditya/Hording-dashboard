"use client";

import { useState, useTransition } from "react";
import { Shield, ShieldCheck, Loader2, AlertCircle, User, Briefcase, Eye, Pencil, ChevronDown, ChevronRight } from "lucide-react";
import { updateUserDetails } from "@/backend/actions/admin-actions";

type Profile = {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
};

type PermItem = {
  id: string;      // e.g. "manage_users"
  label: string;
  desc: string;
  hasWrite: boolean;
};

type PermGroup = {
  group: string;
  icon: string;
  items: PermItem[];
};

const PERMISSION_GROUPS: PermGroup[] = [
  {
    group: "Manage Users",
    icon: "👥",
    items: [
      { id: "manage_users", label: "Manage Users", desc: "View staff list / Add, edit, deactivate users", hasWrite: true },
    ],
  },
  {
    group: "Flex Inventory",
    icon: "📦",
    items: [
      { id: "flex_inventory", label: "Flex Inventory", desc: "View flex inventory / Edit flex inventory entries", hasWrite: true },
    ],
  },
  {
    group: "Quotations",
    icon: "📄",
    items: [
      { id: "quotations", label: "Quotations", desc: "View quotations / Create and edit quotations", hasWrite: true },
    ],
  },
  {
    group: "User Activities",
    icon: "📋",
    items: [
      { id: "user_activities", label: "User Activities", desc: "View activity logs (read-only)", hasWrite: false },
    ],
  },
  {
    group: "Site Enquiries",
    icon: "💬",
    items: [
      { id: "site_enquiries", label: "Site Enquiries", desc: "View enquiries / Respond and close enquiries", hasWrite: true },
    ],
  },
  {
    group: "Site Details",
    icon: "🏗️",
    items: [
      { id: "site_details.basic", label: "Basic Info", desc: "View / Edit site name, city, area, type", hasWrite: true },
      { id: "site_details.location", label: "Location", desc: "View / Edit address, maps link, coordinates", hasWrite: true },
      { id: "site_details.dimensions", label: "Dimensions", desc: "View / Edit size, quantity, total sq ft, printable size", hasWrite: true },
      { id: "site_details.electricity", label: "Electricity", desc: "View / Edit consumer no., consumer name, bill & due dates", hasWrite: true },
      { id: "site_details.financials", label: "Financials & Rates", desc: "View / Edit net rate, DCPM rate, agency rate", hasWrite: true },
      { id: "site_details.landlord", label: "Landlord Info", desc: "View / Edit landlord name, contact, rent amount", hasWrite: true },
      { id: "site_details.photos", label: "Photos", desc: "View / Upload and delete site photos", hasWrite: true },
      { id: "site_details.status", label: "Availability Status", desc: "View / Change site availability status", hasWrite: true },
    ],
  },
];

// Flatten all permission IDs for display purposes
function getAllPermissionLabels(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const group of PERMISSION_GROUPS) {
    for (const item of group.items) {
      map[`${item.id}.read`] = `${item.label} (Read)`;
      if (item.hasWrite) map[`${item.id}.write`] = `${item.label} (Write)`;
    }
  }
  return map;
}

export default function PermissionsClient({ profiles }: { profiles: Profile[] }) {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(PERMISSION_GROUPS.map(g => g.group)));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const permissionLabels = getAllPermissionLabels();

  const openModal = (profile: Profile) => {
    setSelectedProfile(profile);
    setActivePermissions(profile.permissions || []);
    setEditName(profile.name);
    setEditRole(profile.role);
    setError(null);
    setExpandedGroups(new Set(PERMISSION_GROUPS.map(g => g.group)));
  };

  const hasPermission = (permId: string) => activePermissions.includes(permId);

  const togglePermission = (permId: string) => {
    setActivePermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  // Toggling write automatically grants read
  const toggleWrite = (itemId: string) => {
    const readId = `${itemId}.read`;
    const writeId = `${itemId}.write`;
    const hasWrite = hasPermission(writeId);

    if (hasWrite) {
      // Remove write only
      setActivePermissions(prev => prev.filter(p => p !== writeId));
    } else {
      // Grant both read and write
      setActivePermissions(prev => {
        const next = prev.filter(p => p !== readId && p !== writeId);
        return [...next, readId, writeId];
      });
    }
  };

  // Toggling read off also removes write
  const toggleRead = (itemId: string) => {
    const readId = `${itemId}.read`;
    const writeId = `${itemId}.write`;
    const hasRead = hasPermission(readId);

    if (hasRead) {
      // Remove both read and write
      setActivePermissions(prev => prev.filter(p => p !== readId && p !== writeId));
    } else {
      // Grant read only
      setActivePermissions(prev => [...prev.filter(p => p !== readId), readId]);
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  const handleSave = () => {
    if (!selectedProfile) return;
    setError(null);

    if (!editName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    startTransition(async () => {
      const res = await updateUserDetails(selectedProfile.id, editName, editRole, activePermissions);
      if (res?.success) {
        setSelectedProfile(null);
      } else {
        setError(res?.error || "Failed to update user details.");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Granted Permissions</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {profiles.map(profile => {
              const isSuperAdmin = profile.role === 'super_admin';
              const perms = profile.permissions || [];

              return (
                <tr key={profile.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{profile.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      isSuperAdmin
                        ? 'bg-purple-100 text-purple-700'
                        : profile.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {profile.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isSuperAdmin ? (
                      <span className="text-xs text-purple-600 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> All Access
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-w-md">
                        {perms.length === 0 ? (
                          <span className="text-gray-400 text-xs italic">No permissions granted</span>
                        ) : (
                          perms.slice(0, 6).map(p => (
                            <span key={p} className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold whitespace-nowrap ${
                              p.endsWith('.write')
                                ? 'bg-amber-50 border border-amber-200 text-amber-700'
                                : 'bg-sky-50 border border-sky-200 text-sky-700'
                            }`}>
                              {permissionLabels[p] || p}
                            </span>
                          ))
                        )}
                        {perms.length > 6 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            +{perms.length - 6} more
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openModal(profile)}
                      disabled={isSuperAdmin}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Manage Rights
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-white flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  Manage Rights
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{selectedProfile.name} · {selectedProfile.email}</p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 px-2 py-1 bg-sky-50 border border-sky-200 rounded text-sky-700 font-semibold">
                  <Eye className="w-3 h-3" /> Read
                </span>
                <span className="flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-amber-700 font-semibold">
                  <Pencil className="w-3 h-3" /> Write
                </span>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* User Details */}
              <div className="grid grid-cols-2 gap-4 pb-5 border-b border-gray-100">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <User className="h-3 w-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Role
                  </label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="public">Public / Client</option>
                    <option value="admin">Admin</option>
                    <option value="backoffice">Backoffice</option>
                    <option value="marketing">Marketing</option>
                    <option value="execution_head">Execution Head</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {/* Permission Groups */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Access Permissions</p>
                {PERMISSION_GROUPS.map(group => {
                  const isExpanded = expandedGroups.has(group.group);
                  return (
                    <div key={group.group} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Group Header */}
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.group)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                          <span>{group.icon}</span>
                          {group.group}
                        </span>
                        {isExpanded
                          ? <ChevronDown className="w-4 h-4 text-gray-400" />
                          : <ChevronRight className="w-4 h-4 text-gray-400" />
                        }
                      </button>

                      {/* Group Items */}
                      {isExpanded && (
                        <div className="divide-y divide-gray-100">
                          {/* Legend row */}
                          <div className="px-4 py-2 bg-white grid grid-cols-[1fr_80px_80px] gap-2 items-center">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Permission</span>
                            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-0.5"><Eye className="w-3 h-3" />Read</span>
                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-0.5"><Pencil className="w-3 h-3" />Write</span>
                          </div>
                          {group.items.map(item => {
                            const readId = `${item.id}.read`;
                            const writeId = `${item.id}.write`;
                            const hasRead = hasPermission(readId);
                            const hasWrite = hasPermission(writeId);
                            return (
                              <div
                                key={item.id}
                                className={`px-4 py-3 grid grid-cols-[1fr_80px_80px] gap-2 items-center transition-colors ${
                                  hasRead || hasWrite ? 'bg-indigo-50/30' : 'bg-white hover:bg-gray-50/60'
                                }`}
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                </div>
                                {/* Read Toggle */}
                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() => toggleRead(item.id)}
                                    className={`w-10 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                      hasRead
                                        ? 'bg-sky-500 focus:ring-sky-400'
                                        : 'bg-gray-200 focus:ring-gray-400'
                                    }`}
                                    title={hasRead ? 'Remove Read access' : 'Grant Read access'}
                                  >
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                      hasRead ? 'left-4' : 'left-0.5'
                                    }`} />
                                  </button>
                                </div>
                                {/* Write Toggle */}
                                <div className="flex justify-center">
                                  {item.hasWrite ? (
                                    <button
                                      type="button"
                                      onClick={() => toggleWrite(item.id)}
                                      className={`w-10 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                        hasWrite
                                          ? 'bg-amber-500 focus:ring-amber-400'
                                          : 'bg-gray-200 focus:ring-gray-400'
                                      }`}
                                      title={hasWrite ? 'Remove Write access' : 'Grant Write access (also grants Read)'}
                                    >
                                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                        hasWrite ? 'left-4' : 'left-0.5'
                                      }`} />
                                    </button>
                                  ) : (
                                    <span className="text-xs text-gray-300 italic">N/A</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={() => setSelectedProfile(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="inline-flex items-center justify-center px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
