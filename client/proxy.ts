import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // ── DASHBOARD PAGES (/me/*) ───────────────────────────────────
  if (pathname.startsWith('/me')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ── AUTH PAGES & HOME (/login, /signup, /) ──────────────────────
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isLandingPage = pathname === '/';

  if (token && (isAuthPage || isLandingPage)) {
    // If user is already logged in, take them to the board
    return NextResponse.redirect(new URL('/me', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/me/:path*', '/login', '/signup', '/'],
};
