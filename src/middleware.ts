

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   // Define public routes that don't require authentication

//   console.log('calling middleware')
//   const publicRoutes = ['/login']

//   // Check if the current path is a public route
//   const isPublicRoute = publicRoutes.some((route) =>
//     request.nextUrl.pathname.startsWith(route)
//   )

//   // Get refreshToken from cookies
//   const refreshToken = request.cookies.get('refreshToken')?.value
//   console.log('refreshToken', refreshToken)

//   // Redirect root path (/) to /login
//   if (request.nextUrl.pathname === '/') {
//     console.log('got here checking for pathname')
//     const loginUrl = new URL('/login', request.url)
//     return NextResponse.redirect(loginUrl)
//   }

//   // If the route is not public and no refreshToken is present, redirect to login
//   if (!isPublicRoute && !refreshToken) {

//     console.log('got here checking for public Route and pathname')
//   console.log('refreshToken', refreshToken)

//     const loginUrl = new URL('/login', request.url)
//     loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
//     return NextResponse.redirect(loginUrl)
//   }

//   // Allow the request to proceed
//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except:
//      * - Static files (e.g., /_next/, /static/)
//      * - Public files (e.g., /favicon.ico)
//      */
//     '/((?!_next|static|favicon.ico).*)',
//   ],
// }

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware - Pathname:', request.nextUrl.pathname);

  // Define public routes that don't require authentication
  const publicRoutes = ['/login', '/forgot', '/otp', '/reset'];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Get refreshToken from X-Refresh-Token header
  const refreshToken = request.headers.get('x-refresh-token');
  console.log('Middleware - refreshToken:', refreshToken || 'Not found');

  // Redirect root path (/) to /login
  if (request.nextUrl.pathname === '/') {
    console.log('Middleware - Redirecting / to /login');
    try {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    } catch (error) {
      console.error('Middleware - Error creating login URL:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  // If the route is not public and no refreshToken is present, redirect to login
  if (!isPublicRoute && !refreshToken) {
    console.log('Middleware - Redirecting to /login?redirect=', request.nextUrl.pathname);
    try {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    } catch (error) {
      console.error('Middleware - Error creating redirect URL:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  }

  // Allow the request to proceed
  console.log('Middleware - Allowing request to proceed');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - API routes (/api/*)
     * - Static files (e.g., /_next/, /static/)
     * - Public files (e.g., /favicon.ico)
     */
    '/((?!api|_next|static|favicon.ico).*)',
  ],
};
