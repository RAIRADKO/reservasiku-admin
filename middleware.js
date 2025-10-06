import { NextResponse } from 'next/server';

export function middleware(request) {
  const isAdminAuthenticated = request.cookies.has('admin_session');
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/login') && isAdminAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAdminAuthenticated && url.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};