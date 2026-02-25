import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 60;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

const protectedPaths = ['/dashboard', '/admin'];
const authPaths = ['/auth/login', '/auth/register'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }

  const token = req.cookies.get('auth-token')?.value;
  const session = token ? await verifyToken(token) : null;

  // Redirect authenticated users away from auth pages
  if (authPaths.some((p) => pathname.startsWith(p)) && session) {
    if (session.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (session.role !== 'storeOwner' && session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (session.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Protect dashboard API routes
  if (pathname.startsWith('/api/stores') && req.method !== 'GET') {
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Protect admin API routes
  if (pathname.startsWith('/api/admin')) {
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/api/:path*',
  ],
};
