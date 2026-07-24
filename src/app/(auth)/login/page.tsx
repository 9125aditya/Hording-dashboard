"use client";

import { useTransition, useState } from "react";
import { loginUser } from "@/backend/actions/auth-actions";
import { LockClosedIcon, UserCircleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await loginUser(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 border-b border-border bg-slate-50/50 relative overflow-hidden">
        {/* Subtle decorative line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/60 to-primary"></div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-1">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Sign in to your Sellads account.</p>
      </div>
      

      <form onSubmit={handleLogin} className="px-8 py-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircleIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="email" 
                name="email"
                placeholder="you@company.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? "Authenticating..." : "Admin Login"}
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
