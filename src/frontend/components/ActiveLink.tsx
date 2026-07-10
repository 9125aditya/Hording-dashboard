"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2.5 text-[13.5px] font-medium rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-indigo-50 text-indigo-700 font-semibold'
          : 'text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-700'
      } ${className || ''}`}
    >
      {children}
    </Link>
  );
}
