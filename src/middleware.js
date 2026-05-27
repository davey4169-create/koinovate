// ============================================================
// src/middleware.js
// Next.js middleware for route protection
// ============================================================

import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Admin routes - will be checked by API routes
  if (pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  // User routes - will be checked by API routes
  if (pathname.startsWith('/api/user')) {
    return NextResponse.next()
  }

  // Public routes
  if (['/auth', '/'].includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes - redirect to auth if not logged in
  // This will be handled by client-side auth check in layout.js
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
