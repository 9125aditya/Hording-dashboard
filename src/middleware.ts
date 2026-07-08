import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    const adminRoutes = [
      '/admin/dashboard', '/admin/inventory', '/admin/enquiries', '/admin/staff', '/admin/approvals', '/admin/attendance', '/admin/permissions',
      '/dashboard', '/inventory', '/enquiries', '/staff', '/admin-map', '/approvals', '/attendance', '/permissions'
    ];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))

    if (isAdminRoute) {
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
      
      // Fetch user role
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      const role = profile?.role || 'public';
      
      // Rule: Public users cannot access ANY admin routes
      if (role === 'public') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
      
      // Rule: Only super_admin can access Staff Management, Approvals, and Permissions
      const isSuperAdminRoute = pathname.startsWith('/admin/staff') || pathname.startsWith('/staff') || pathname.startsWith('/admin/approvals') || pathname.startsWith('/approvals') || pathname.startsWith('/admin/permissions') || pathname.startsWith('/permissions');
      if (isSuperAdminRoute && role !== 'super_admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
      }
    }
    return supabaseResponse
  } catch (error) {
    // If Supabase throws an error (e.g. missing env variables), we shouldn't crash the whole site.
    // We just return next() for public routes, but for protected routes we probably want to redirect.
    console.error("Middleware Supabase Error:", error);
    
    const { pathname } = request.nextUrl
    const adminRoutes = [
      '/admin/dashboard', '/admin/inventory', '/admin/enquiries', '/admin/staff', '/admin/approvals', '/admin/attendance', '/admin/permissions',
      '/dashboard', '/inventory', '/enquiries', '/staff', '/admin-map', '/approvals', '/attendance', '/permissions'
    ];
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
    
    if (isAdminRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    return supabaseResponse
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
