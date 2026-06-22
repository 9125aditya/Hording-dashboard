"use client";

import { useTransition } from "react";
import { loginAsClient } from "@/lib/auth-actions";
import { LogIn, Mail } from "lucide-react";

export default function ClientLoginPage() {
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await loginAsClient();
    });
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 text-center border-b border-border bg-ink text-cloud">
        <div className="mx-auto w-16 h-16 bg-cloud/10 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-8 w-8 text-cloud" />
        </div>
        <h1 className="font-heading text-2xl font-bold">Brand Portal</h1>
        <p className="text-sky-tint/80 mt-2 text-sm">Sign in to track your active campaigns.</p>
      </div>
      
      <form onSubmit={handleLogin} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="email" 
                defaultValue="brand@agency.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-ink focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="h-5 w-5 flex items-center justify-center text-muted-foreground font-serif font-bold text-xl leading-none">*</div>
              </div>
              <input 
                type="password" 
                defaultValue="password123"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-ink focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center rounded-lg bg-ink text-cloud font-semibold shadow-md hover:bg-ink/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? "Signing in..." : "Access Portal"}
        </button>
        
        <div className="text-center mt-4">
           <span className="text-xs text-muted-foreground">Mock Authentication Enabled. Use any credentials.</span>
        </div>
      </form>
    </div>
  );
}
