"use client";

import { useTransition } from "react";
import { loginAsAdmin } from "@/lib/auth-actions";
import { Lock, UserCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await loginAsAdmin();
    });
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 text-center border-b border-border bg-slate-50/50">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Admin Portal</h1>
        <p className="text-muted-foreground mt-2">Sign in to manage inventory and staff.</p>
      </div>
      
      <form onSubmit={handleLogin} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email / Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="text" 
                defaultValue="admin@estroc.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="password" 
                defaultValue="password123"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? "Authenticating..." : "Sign in to Dashboard"}
        </button>
        
        <div className="text-center mt-4">
           <span className="text-xs text-muted-foreground">Mock Authentication Enabled. Use any credentials.</span>
        </div>
      </form>
    </div>
  );
}
