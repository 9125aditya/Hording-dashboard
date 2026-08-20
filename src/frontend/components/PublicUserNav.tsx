"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { logout } from "@/backend/actions/auth-actions";
import { clearTabSession } from "@/frontend/components/TabSessionManager";
import { ArrowRightOnRectangleIcon, Squares2X2Icon, UserCircleIcon, ChevronDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface PublicUserNavProps {
  user: {
    name: string;
    role: string;
    email?: string;
  } | null;
  isAdmin: boolean;
}

export default function PublicUserNav({ user, isAdmin }: PublicUserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, startLogoutTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    clearTabSession();
    startLogoutTransition(async () => {
      await logout();
    });
  };

  if (!user) {
    return null;
  }

  const userInitial = (user.name || user.email || 'A')[0].toUpperCase();
  const displayRole = user.role === 'super_admin' 
    ? 'Super Admin' 
    : user.role === 'admin' 
    ? 'Admin' 
    : user.role.replace('_', ' ');

  return (
    <div className="flex items-center gap-2 relative" ref={dropdownRef}>
      {/* Desktop direct Quick Dashboard Link */}
      <Link
        href="/dashboard"
        className="hidden lg:flex items-center gap-1.5 h-9 px-3.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/70 text-xs font-bold transition-colors shadow-xs"
      >
        <Squares2X2Icon className="h-3.5 w-3.5" />
        Dashboard
      </Link>

      {/* User Profile Pill & Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all text-left group cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
          {userInitial}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[13px] font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight truncate max-w-[160px]">
            {user.name || 'Staff'}
          </span>
          <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider leading-none whitespace-nowrap">
            {displayRole}
          </span>
        </div>
        <ChevronDownIcon className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Direct Desktop Quick Logout Button */}
      <form onSubmit={handleLogout} className="hidden sm:inline-block">
        <button
          type="submit"
          disabled={isLoggingOut}
          title="Sign Out"
          className="h-9 px-3.5 rounded-full border border-slate-200 bg-white text-slate-600 text-xs font-bold flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors shadow-xs disabled:opacity-60 cursor-pointer"
        >
          {isLoggingOut ? (
            <ArrowPathIcon className="h-3.5 w-3.5 animate-spin text-red-600" />
          ) : (
            <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
          )}
          <span>{isLoggingOut ? "Signing out..." : "Logout"}</span>
        </button>
      </form>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
            {user.email && <p className="text-[11px] text-slate-500 truncate">{user.email}</p>}
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-blue-50 text-blue-700 uppercase whitespace-nowrap">
              {displayRole}
            </span>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <Squares2X2Icon className="h-4 w-4 text-slate-400" />
              Management Dashboard
            </Link>
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <UserCircleIcon className="h-4 w-4 text-slate-400" />
              Profile Settings
            </Link>
          </div>

          <div className="pt-1 border-t border-slate-100">
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                disabled={isLoggingOut}
                className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left disabled:opacity-60 cursor-pointer"
              >
                {isLoggingOut ? (
                  <ArrowPathIcon className="h-4 w-4 animate-spin text-red-600" />
                ) : (
                  <ArrowRightOnRectangleIcon className="h-4 w-4 text-red-500" />
                )}
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
