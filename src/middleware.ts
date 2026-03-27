import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Standard Auth Paths:
const protectedRoutes = [
  "/licensing/apply", 
  "/complaints/track", 
  "/complaints/submit",
  "/consultation/apply",
  "/cybersecurity/report",
  "/domains/manage",
  "/dashboard/user" 
];

// Admin Only Paths:
const adminRoutes = ["/admin"];

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  // ── Rate Limiting ──────────────────────────────────────
  if (isAdmin) {
    const { limited, retryAfterMs } = rateLimit(`admin:${ip}`, 20, 60_000);
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }
  }

  if (isProtected) {
    const { limited, retryAfterMs } = rateLimit(`auth:${ip}`, 10, 60_000);
    if (limited) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
      );
    }
  }

  // ── Auth Check ─────────────────────────────────────────
  if (isProtected || isAdmin) {
    // NextAuth v5 uses "authjs.session-token", v4 uses "next-auth.session-token"
    const token =
      request.cookies.get("authjs.session-token")?.value ||
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!token) {
      // Redirect unauthenticated users to login with the callback
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/licensing/apply/:path*", 
    "/complaints/track/:path*", 
    "/complaints/submit/:path*",
    "/consultation/apply/:path*",
    "/cybersecurity/report/:path*",
    "/domains/manage/:path*",
    "/dashboard/user/:path*",
    "/admin/:path*"
  ],
};
