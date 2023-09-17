import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ['/login', '/register', '/forgotpassword', '/verifyemail','/updatepassword'];
  const token = request.cookies.get('token')?.value || '';
  const ftoken = request.cookies.get('ftoken')?.value || '';

  if (publicPaths.includes(path)) {
   
    if (path === '/verifyemail' ) {
      return NextResponse.next();
    }
     if (path === '/updatepassword' ) {
      return NextResponse.next();
    }
  
    
    if (ftoken) {
      return NextResponse.redirect(new URL('/updatepassword', request.nextUrl));
    }
    
    return NextResponse.next(); 
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }



  return NextResponse.next(); 
}


export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/login',
    '/register',
    '/verifyemail',
    '/forgotpassword',
    '/verifypassword',
    '/verifypasswordemail',
  ],
};
