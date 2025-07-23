import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const accessToken = cookies.get('accessToken');

  const isRootPath = nextUrl.pathname === '/';
  const isAuthenticated = !!accessToken;

  if (isAuthenticated) {
    if (isRootPath) {
      return NextResponse.redirect(new URL('/users', request.url));
    }
    return NextResponse.next();
  } else {
    if (!isRootPath) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'],
};
