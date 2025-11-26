import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Routes that should stay accessible only when a user is signed out
const authPaths = [
  "/auth/sign-in",
  "/auth/register",
  "/auth/email-verification",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/forgot-password",
  "/auth/join-team",
  "/auth/player-signin",
  "/auth/register/successful",
]

// Enforce that each base path is only reachable by the mapped role
const roleBasedRoutes: Record<string, string> = {
  "/coordinator": "coordinator",
  "/player": "player",
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("k_n_q_auth_token")
  const { pathname } = request.nextUrl

  // Signed-in users hitting auth pages get bounced to their dashboard
  if (authPaths.includes(pathname)) {
    if (token) {
      try {
        const { payload } = await jwtVerify(token.value, secret)
        const userRole = payload.role as string
        const redirectPath = userRole === "coordinator" ? "/coordinator" : "/player"
        return NextResponse.redirect(new URL(redirectPath, request.url))
      } catch (error) {
        console.error("JWT verification failed on auth route:", error)
        const response = NextResponse.next()
        response.cookies.delete("k_n_q_auth_token")
        return response
      }
    }
    return NextResponse.next()
  }

  // Home page doubles as the sign-in landing page
  if (pathname === "/") {
    if (token) {
      let redirectPath = "/"
      try {
        const { payload } = await jwtVerify(token.value, secret)
        const userRole = payload.role as string
        redirectPath = userRole === "coordinator" ? "/coordinator" : "/player"
      } catch (error) {
        console.error("JWT verification failed:", error)
        const signInUrl = new URL("/", request.url)
        signInUrl.searchParams.set("callbackUrl", "/")
        const response = NextResponse.redirect(signInUrl)
        response.cookies.delete("k_n_q_auth_token")
        return response
      }
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    return NextResponse.next()
  }

  // All other routes require authentication
  if (!token) {
    const signInUrl = new URL("/", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Determine the caller's role from the token
  let userRole: string | undefined
  try {
    const { payload } = await jwtVerify(token.value, secret)
    userRole = payload.role as string
  } catch (error) {
    console.error("JWT verification failed in protected route:", error)
    const response = NextResponse.redirect(new URL("/auth/sign-in", request.url))
    response.cookies.delete("k_n_q_auth_token")
    return response
  }

  // Pick the longest matching protected prefix so we can enforce role rules
  let baseRoute: string | undefined
  for (const route in roleBasedRoutes) {
    if (pathname.startsWith(route)) {
      baseRoute = route
      break
    }
  }

  if (baseRoute) {
    const requiredRole = roleBasedRoutes[baseRoute]
    if (userRole && userRole !== requiredRole) {
      const correctPath = userRole === "coordinator" ? "/coordinator" : "/player"
      return NextResponse.redirect(new URL(correctPath, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|public|images|videos|audio|rules|leaderboard|live-games|icons|favicon.ico|about|contact|policies|terms).*)",
  ],
}
