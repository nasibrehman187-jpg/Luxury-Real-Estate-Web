import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass i18n middleware for static HTML verification files
  if (pathname.endsWith('.html') || pathname.includes('google')) {
    return NextResponse.next();
  }

  // Admin route protection check
  if (pathname.includes('/admin')) {
    const supabaseToken = request.cookies.get('sb-access-token')?.value || request.cookies.get('sb-auth-token')?.value;
    // Middleware-level preliminary check. Actual server component checks role against admin_users.
    if (!supabaseToken && process.env.NODE_ENV === 'production') {
      const loginUrl = new URL('/en', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
