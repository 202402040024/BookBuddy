import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production"
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token",
  });

  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute  = pathname.startsWith("/profile") || pathname.startsWith("/library");

  // ── Not logged in at all ───────────────────────────────────
  if ((isAdminRoute || isUserRoute) && !token) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // ── Logged in but NOT admin → block admin routes ───────────
  if (isAdminRoute && token?.role !== "admin") {
    const url = new URL("/", req.url);
    url.searchParams.set("error", "access_denied");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/library/:path*"],
};
