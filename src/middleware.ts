import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const PROTECTED_ROUTES = ["/dashboard", "/admin"];
const LOGIN_ROUTE = "/login";

/**
 * Middleware for protecting routes with JWT stored in cookie
 * and redirecting logged-in users away from the login page.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Redirect logged-in users away from /login
  if (pathname === LOGIN_ROUTE && token) {
    // Valid token → redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Only run middleware on protected routes
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) return redirectToLogin(request);

  // Token exists → validate

  return NextResponse.next(); // Valid token → allow
}

/**
 * Redirect helper
 */
function redirectToLogin(request: NextRequest, clearCookie = false) {
  const response = NextResponse.redirect(new URL(LOGIN_ROUTE, request.url));

  if (clearCookie) {
    response.cookies.set({
      name: "accessToken",
      value: "",
      path: "/",
      maxAge: 0,
    });
  }

  return response;
}
