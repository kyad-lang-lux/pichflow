import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('pichflow_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/connexion') || 
                     request.nextUrl.pathname.startsWith('/inscription');

  // 1. Si pas de token et tente d'aller sur le dashboard -> Redirection connexion
  if (!token && !isAuthPage && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  // 2. Si déjà connecté et tente d'aller sur connexion/inscription -> Redirection dashboard
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/connexion', '/inscription'],
};