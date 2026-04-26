import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type UserRole = "ADMIN" | "PROVIDER" | "CUSTOMER";

const authRoutes = ["/sign-in", "/sign-up", "/reset-password"];
const protectedRoutes = ["/admin", "/provider", "/customer"];

function decodeRoleFromToken(token: string): UserRole | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    const parsed = JSON.parse(decoded) as { role?: string };

    if (parsed.role === "ADMIN" || parsed.role === "PROVIDER" || parsed.role === "CUSTOMER") {
      return parsed.role;
    }

    return null;
  } catch {
    return null;
  }
}

function roleHome(role: UserRole | null) {
  if (role === "ADMIN") return "/admin";
  if (role === "PROVIDER") return "/provider/dashboard";
  if (role === "CUSTOMER") return "/customer";
  return "/";
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = token ? decodeRoleFromToken(token) : null;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!token && isProtectedRoute) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  if (token) {
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL(roleHome(role), request.url));
    }

    if (pathname.startsWith("/provider") && role !== "PROVIDER") {
      return NextResponse.redirect(new URL(roleHome(role), request.url));
    }

    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL(roleHome(role), request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};