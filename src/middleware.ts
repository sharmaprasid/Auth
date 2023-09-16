import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 

export function middleware(request: NextRequest) {
const path=request.nextUrl.pathname;
const publicPAth=path=='/login'||  path=='/register'||path=='/forgotpassword';
const token=request.cookies.get("token")?.value||'';
const ftoken=request.cookies.get("ftoken")?.value||'';
if(publicPAth && token){
    return NextResponse.redirect(new URL('/', request.nextUrl))
}
if(publicPAth && ftoken){
    return NextResponse.redirect(new URL('/updatepassword', request.nextUrl))
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
    '/verifyemail',
    '/forgotpassword',
    '/verifypasswordemail'
  ],
}