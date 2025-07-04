// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   // If the user is visiting the root path `/`
  // if (request.nextUrl.pathname === '/') {
  //   const loginUrl = new URL('/login', request.url)
  //   return NextResponse.redirect(loginUrl)
  // }

//   // Allow all other requests
//   return NextResponse.next()
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = ['/login']

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // Get refreshToken from cookies
  const refreshToken = request.cookies.get('refreshToken')?.value

  // Redirect root path (/) to /login
  if (request.nextUrl.pathname === '/') {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // If the route is not public and no refreshToken is present, redirect to login
  if (!isPublicRoute && !refreshToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Allow the request to proceed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - Static files (e.g., /_next/, /static/)
     * - Public files (e.g., /favicon.ico)
     */
    '/((?!_next|static|favicon.ico).*)',
  ],
}