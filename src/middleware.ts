import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
const path=request.nextUrl.pathname;
const publicPAth=path=='/login'||  path=='/register';
const token=request.cookies.get("token")?.value||'';
if(publicPAth && token){
    return NextResponse.redirect(new URL('/', request.nextUrl))
}
if(!publicPAth && !token){
    return NextResponse.redirect(new URL('/login', request.nextUrl))
}

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/profile/:path*',
    '/login',
    '/register',
    '/verifyemail'
  ],
}