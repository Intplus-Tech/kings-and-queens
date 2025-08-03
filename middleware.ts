import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that don't require authentication
const publicPaths = ['/sign-in', '/sign-up', '/sign-up/successful']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('k_n_q_auth_token')

  const { pathname } = request.nextUrl

  // Allow access to public paths even without token
  if (publicPaths.includes(pathname)) {
    // If user is already logged in, redirect to home page
    if (token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Check if user is authenticated for protected routes
  if (!token) {
    // Save the original pathname to redirect back after login
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Optional: Add token validation logic here if needed
  // For example, check token expiration or validate token format
  // If token is invalid, redirect to sign-in

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/*)
     * - static files (_next/static/*)
     * - public files (public/*)
     * - favicon.ico
     */
    '/((?!api|_next/static|_next/image|public|images|icons|favicon.ico).*)',
  ],
}
