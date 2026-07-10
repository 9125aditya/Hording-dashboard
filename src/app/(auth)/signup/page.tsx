"use client";

import { useTransition, useState } from "react";
import { signupUser } from "@/backend/actions/auth-actions";
import { Lock, UserCircle, Building2, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    startTransition(async () => {
      const res = await signupUser(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-8 text-center border-b border-border bg-slate-50/50">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Create an Account</h1>
        <p className="text-muted-foreground mt-2">Join Sellads Advertising to book premium OOH media.</p>
      </div>
      
      <form onSubmit={handleSignup} className="p-8 space-y-6">
        <div className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="text" 
                name="name"
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCircle className="h-5 w-5 text-muted-foreground" />
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
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="password" 
                name="password"
                placeholder="Create a strong password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-muted-foreground" />
              </div>
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Re-enter your password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
              />
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
          {isPending ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
