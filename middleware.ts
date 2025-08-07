import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Auth routes that authenticated users shouldn't access
const authPaths = ["/auth/sign-in", "/auth/register", "/auth/email-verification", "/auth/forgot-password", "/auth/reset-password", "/auth/forgot-password", "/auth/join-team", "/auth/player-signin", "/auth/register/successful"]

// Role-based route access rules with prefix matching
const roleBasedRoutes: Record<string, string> = {
  "/coordinator": "coordinator", // Only coordinator role for /coordinator and its dynamic routes
  "/player": "player", // Only player role for /player and its dynamic routes
}

// Create a TextEncoder instance for the secret
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("k_n_q_auth_token")
  const { pathname } = request.nextUrl

  // Handle auth routes - redirect authenticated users to their dashboard
  if (authPaths.includes(pathname)) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token.value, secret)
        const userRole = payload.role as string
        const redirectPath = userRole === "coordinator" ? "/coordinator" : "/player"
        return NextResponse.redirect(new URL(redirectPath, request.url))
      } catch (error) {
        console.error("JWT verification failed on auth route:", error)
        // Invalid token, clear it and allow access to auth route
        const response = NextResponse.next()
        response.cookies.delete("k_n_q_auth_token")
        return response
      }
    }
    // Not authenticated, allow access to auth routes
    return NextResponse.next()
  }

  // Handle home page (/) - accessible only to unauthenticated users
  if (pathname === "/") {
    if (token) {
      // Redirect authenticated users to their role-based dashboard
      let redirectPath = "/"
      try {
        const { payload } = await jwtVerify(token.value, secret)
        const userRole = payload.role as string
        redirectPath = userRole === "coordinator" ? "/coordinator" : "/player"
      } catch (error) {
        console.error("JWT verification failed:", error)
        // Invalid token, redirect to sign-in and clear the token
        const signInUrl = new URL("/", request.url)
        signInUrl.searchParams.set("callbackUrl", "/")
        const response = NextResponse.redirect(signInUrl)
        response.cookies.delete("k_n_q_auth_token")
        return response
      }
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    return NextResponse.next() // Allow unauthenticated access to /
  }

  // Check if user is authenticated for protected routes
  if (!token) {
    const signInUrl = new URL("/", request.url)
    // Set default callback URL to /, preserving any existing callbackUrl if present
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Decode and validate token to get user role
  let userRole: string | undefined
  try {
    const { payload } = await jwtVerify(token.value, secret)
    userRole = payload.role as string
  } catch (error) {
    console.error("JWT verification failed in protected route:", error)
    // Clear invalid token and redirect to sign-in
    const response = NextResponse.redirect(new URL("/auth/sign-in", request.url))
    response.cookies.delete("k_n_q_auth_token")
    return response
  }

  // Find the base route for role-based access (handle dynamic routes)
  let baseRoute: string | undefined
  for (const route in roleBasedRoutes) {
    if (pathname.startsWith(route)) {
      baseRoute = route
      break
    }
  }

  // Check role-based access for matched base route
  if (baseRoute) {
    const requiredRole = roleBasedRoutes[baseRoute]
    if (userRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const correctPath = userRole === "coordinator" ? "/coordinator" : "/player"
      return NextResponse.redirect(new URL(correctPath, request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|public|images|icons|favicon.ico).*)"],
}
