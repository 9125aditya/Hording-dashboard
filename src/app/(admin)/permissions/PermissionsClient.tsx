"use client";

import { useState, useTransition } from "react";
import {
  updateUserDetails,
  deleteAdminUser,
} from "@/backend/actions/admin-actions";
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Shield,
  Trash2,
  UserCog,
  X,
} from "lucide-react";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  permissions?: string[] | null;
};

const PERMISSION_GROUPS = [
  {
    group: "Dashboard",
    icon: "📊",
    items: [
      {
        id: "dashboard.overview",
        label: "Dashboard Overview",
        desc: "View dashboard statistics and overview",
        hasWrite: false,
      },
    ],
  },
  {
    group: "Site Management",
    icon: "📍",
    items: [
      {
        id: "sites.list",
        label: "Sites List",
        desc: "View all hoarding sites",
        hasWrite: true,
      },
      {
        id: "sites.create",
        label: "Create Sites",
        desc: "Add new hoarding sites",
        hasWrite: true,
      },
      {
        id: "sites.edit",
        label: "Edit Sites",
        desc: "Modify existing hoarding sites",
        hasWrite: true,
      },
      {
        id: "sites.delete",
        label: "Delete Sites",
        desc: "Remove hoarding sites",
        hasWrite: true,
      },
    ],
  },
  {
    group: "Map",
    icon: "🗺️",
    items: [
      {
        id: "map.view",
        label: "View Map",
        desc: "View hoarding locations on the map",
        hasWrite: false,
      },
      {
        id: "map.edit",
        label: "Edit Map",
        desc: "Modify site locations and map data",
        hasWrite: true,
      },
    ],
  },
  {
    group: "Catalog",
    icon: "📚",
    items: [
      {
        id: "catalog.view",
        label: "View Catalog",
        desc: "View the public hoarding catalog",
        hasWrite: false,
      },
      {
        id: "catalog.edit",
        label: "Edit Catalog",
        desc: "Manage catalog details and visibility",
        hasWrite: true,
      },
    ],
  },
  {
    group: "Quotations",
    icon: "📄",
    items: [
      {
        id: "quotations.list",
        label: "View Quotations",
        desc: "View quotations and quotation history",
        hasWrite: false,
      },
      {
        id: "quotations.create",
        label: "Create Quotations",
        desc: "Create new quotations",
        hasWrite: true,
      },
      {
        id: "quotations.edit",
        label: "Edit Quotations",
        desc: "Modify existing quotations",
        hasWrite: true,
      },
      {
        id: "quotations.delete",
        label: "Delete Quotations",
        desc: "Delete quotations",
        hasWrite: true,
      },
    ],
  },
  {
    group: "Customers",
    icon: "👥",
    items: [
      {
        id: "customers.list",
        label: "View Customers",
        desc: "View customer information",
        hasWrite: false,
      },
      {
        id: "customers.create",
        label: "Create Customers",
        desc: "Add new customers",
        hasWrite: true,
      },
      {
        id: "customers.edit",
        label: "Edit Customers",
        desc: "Modify customer information",
        hasWrite: true,
      },
      {
        id: "customers.delete",
        label: "Delete Customers",
        desc: "Delete customers",
        hasWrite: true,
      },
    ],
  },
  {
    group: "Staff",
    icon: "🧑‍💼",
    items: [
      {
        id: "staff.list",
        label: "View Staff",
        desc: "View staff members",
        hasWrite: false,
      },
      {
        id: "staff.create",
        label: "Create Staff",
        desc: "Add new staff members",
        hasWrite: true,
      },
      {
        id: "staff.edit",
        label: "Edit Staff",
        desc: "Modify staff information",
        hasWrite: true,
      },
      {
        id: "staff.delete",
        label: "Delete Staff",
        desc: "Remove staff members",
        hasWrite: true,
      },
    ],
  },
  {
    group: "Site Details",
    icon: "🏢",
    items: [
      {
        id: "site_details.basic",
        label: "Basic Information",
        desc: "View / Edit site details",
        hasWrite: true,
      },
      {
        id: "site_details.photos",
        label: "Photos",
        desc: "View / Upload and delete site photos",
        hasWrite: true,
      },
      {
        id: "site_details.status",
        label: "Availability Status",
        desc: "View / Change site availability status",
        hasWrite: true,
      },
    ],
  },
];

// Flatten all permission IDs for display purposes
function getAllPermissionLabels(): Record<string, string> {
  const map: Record<string, string> = {};

  for (const group of PERMISSION_GROUPS) {
    for (const item of group.items) {
      map[`${item.id}.read`] = `${item.label} (Read)`;

      if (item.hasWrite) {
        map[`${item.id}.write`] = `${item.label} (Write)`;
      }
    }
  }

  return map;
}

export default function PermissionsClient({
  profiles,
}: {
  profiles: Profile[];
}) {
  const [selectedProfile, setSelectedProfile] =
    useState<Profile | null>(null);

  const [activePermissions, setActivePermissions] = useState<string[]>([]);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(PERMISSION_GROUPS.map((g) => g.group))
  );

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const permissionLabels = getAllPermissionLabels();

  const handleDelete = (userId: string, userName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${userName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setDeletingId(userId);

    startTransition(async () => {
      try {
        const res = await deleteAdminUser(userId);

        if (!res?.success) {
          alert(res?.error || "Failed to delete user.");
        }
      } catch (err) {
        console.error("Delete error:", err);
        alert(
          err instanceof Error
            ? err.message
            : "Unexpected error while deleting user."
        );
      } finally {
        setDeletingId(null);
      }
    });
  };

  const openModal = (profile: Profile) => {
    setSelectedProfile(profile);
    setActivePermissions(profile.permissions || []);
    setEditName(profile.name ?? "");
    setEditRole(profile.role ?? "");
    setError(null);

    setExpandedGroups(
      new Set(PERMISSION_GROUPS.map((g) => g.group))
    );
  };

  const hasPermission = (permId: string) =>
    activePermissions.includes(permId);

  const togglePermission = (permId: string) => {
    setActivePermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((p) => p !== permId)
        : [...prev, permId]
    );
  };

  // Toggling write automatically grants read
  const toggleWrite = (itemId: string) => {
    const readId = `${itemId}.read`;
    const writeId = `${itemId}.write`;

    const hasWrite = hasPermission(writeId);

    if (hasWrite) {
      setActivePermissions((prev) =>
        prev.filter((p) => p !== writeId)
      );
    } else {
      setActivePermissions((prev) => {
        const next = prev.filter(
          (p) => p !== readId && p !== writeId
        );

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
      setActivePermissions((prev) =>
        prev.filter(
          (p) => p !== readId && p !== writeId
        )
      );
    } else {
      setActivePermissions((prev) => [
        ...prev.filter((p) => p !== readId),
        readId,
      ]);
    }
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);

      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }

      return next;
    });
  };

  const handleSave = () => {
    if (!selectedProfile) return;

    setError(null);

    const trimmedName = editName.trim();

    if (!trimmedName) {
      setError("Name cannot be empty.");
      return;
    }

    startTransition(async () => {
      console.log("Saving permissions:", {
        userId: selectedProfile.id,
        name: trimmedName,
        role: editRole,
        permissions: activePermissions,
      });

      try {
        const res = await updateUserDetails(
          selectedProfile.id,
          trimmedName,
          editRole,
          activePermissions
        );

        console.log("Save response:", res);

        if (res?.success) {
          alert("Permissions saved successfully!");
          setSelectedProfile(null);
        } else {
          const errorMessage =
            res?.error || "Failed to update user details.";

          console.error("Save failed:", errorMessage);
          setError(errorMessage);
          alert(errorMessage);
        }
      } catch (err) {
        console.error("Unexpected save error:", err);

        const errorMessage =
          err instanceof Error
            ? err.message
            : "Unexpected error while saving permissions.";

        setError(errorMessage);
        alert(errorMessage);
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
              <th className="px-6 py-4">
                Granted Permissions
              </th>
              <th className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {profiles.map((profile) => {
              const isSuperAdmin =
                profile.role === "super_admin";

              const perms = profile.permissions || [];

              return (
                <tr
                  key={profile.id}
                  className="hover:bg-gray-50/60 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {profile.name}
                    </div>

                    <div className="text-gray-500 text-xs mt-0.5">
                      {profile.email}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        isSuperAdmin
                          ? "bg-purple-100 text-purple-700"
                          : profile.role === "admin"
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {profile.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {isSuperAdmin ? (
                      <span className="text-sm text-purple-600 font-medium">
                        Full Access
                      </span>
                    ) : perms.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {perms.slice(0, 3).map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {permissionLabels[permission] || permission}
                          </span>
                        ))}

                        {perms.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                            +{perms.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No permissions
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(profile)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        <UserCog className="w-3.5 h-3.5" />
                        Manage
                      </button>

                      {!isSuperAdmin && (
                        <button
                          onClick={() =>
                            handleDelete(
                              profile.id,
                              profile.name || profile.email || "this user"
                            )
                          }
                          disabled={
                            deletingId === profile.id || isPending
                          }
                          className="inline-flex items-center justify-center p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {deletingId === profile.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSelectedProfile(null)}
          />

          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-5 border-b flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Manage Permissions
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Configure access for {selectedProfile.email}
                </p>
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name
                  </label>

                  <input
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Role
                  </label>

                  <select
                    value={editRole}
                    onChange={(e) =>
                      setEditRole(e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="public">Public</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">
                      Super Admin
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {PERMISSION_GROUPS.map((group) => {
                  const isExpanded =
                    expandedGroups.has(group.group);

                  return (
                    <div
                      key={group.group}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          toggleGroup(group.group)
                        }
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                      >
                        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                          <span>{group.icon}</span>
                          {group.group}
                        </span>

                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="divide-y divide-gray-100">
                          <div className="px-4 py-2 bg-white grid grid-cols-[1fr_80px_80px] gap-2 items-center">
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                              Permission
                            </span>

                            <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-0.5">
                              <Eye className="w-3 h-3" />
                              Read
                            </span>

                            <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider text-center flex items-center justify-center gap-0.5">
                              <Pencil className="w-3 h-3" />
                              Write
                            </span>
                          </div>

                          {group.items.map((item) => {
                            const readId = `${item.id}.read`;
                            const writeId = `${item.id}.write`;

                            const hasRead =
                              hasPermission(readId);

                            const hasWrite =
                              hasPermission(writeId);

                            return (
                              <div
                                key={item.id}
                                className={`px-4 py-3 grid grid-cols-[1fr_80px_80px] gap-2 items-center transition-colors ${
                                  hasRead || hasWrite
                                    ? "bg-indigo-50/30"
                                    : "bg-white hover:bg-gray-50/60"
                                }`}
                              >
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {item.label}
                                  </p>

                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {item.desc}
                                  </p>
                                </div>

                                <div className="flex justify-center">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleRead(item.id)
                                    }
                                    className={`w-10 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                      hasRead
                                        ? "bg-sky-500 focus:ring-sky-400"
                                        : "bg-gray-200 focus:ring-gray-400"
                                    }`}
                                  >
                                    <span
                                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                        hasRead
                                          ? "left-4"
                                          : "left-0.5"
                                      }`}
                                    />
                                  </button>
                                </div>

                                <div className="flex justify-center">
                                  {item.hasWrite ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        toggleWrite(item.id)
                                      }
                                      className={`w-10 h-6 rounded-full transition-all relative focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                                        hasWrite
                                          ? "bg-amber-500 focus:ring-amber-400"
                                          : "bg-gray-200 focus:ring-gray-400"
                                      }`}
                                    >
                                      <span
                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                                          hasWrite
                                            ? "left-4"
                                            : "left-0.5"
                                        }`}
                                      />
                                    </button>
                                  ) : (
                                    <span className="text-xs text-gray-300 italic">
                                      N/A
                                    </span>
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
                {isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}

                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
