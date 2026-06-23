import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authRole = request.cookies.get('auth_role')?.value;
  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  const adminRoutes = ['/dashboard', '/inventory', '/enquiries', '/attendance'];
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));

  if (isAdminRoute && authRole !== 'admin') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/inventory/:path*', '/enquiries/:path*', '/attendance/:path*'],
};
