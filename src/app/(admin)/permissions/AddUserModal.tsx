"use client";

import { useState, useTransition } from "react";
import { UserPlus, X, Loader2, AlertCircle } from "lucide-react";
import { createAdminUser } from "@/backend/actions/admin-actions";

export default function AddUserModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createAdminUser(formData);
      if (res?.success) {
        setIsOpen(false);
        setError(null);
      } else {
        setError(res?.error || "Failed to create user. Please try again.");
      }
    });
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); setError(null); }}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
      >
        <UserPlus className="mr-2 h-4 w-4" /> Add User
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-md border border-border shadow-lg rounded-xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h2 className="text-lg font-bold">Add Dashboard User</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors rounded-md p-1 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required name="name" type="text" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="e.g. John Doe" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email Address</label>
                  <input required name="email" type="email" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="john@company.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Temporary Password</label>
                  <input required name="password" type="password" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="Min. 6 characters" minLength={6} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Dashboard Role</label>
                  <select required name="role" className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all">
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-border mt-6">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2.5 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button disabled={isPending} type="submit" className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
