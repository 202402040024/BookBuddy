import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isUserRoute  = pathname.startsWith("/profile") || pathname.startsWith("/library");

  // Not logged in → send to login
  if ((isAdminRoute || isUserRoute) && !token) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }

  // Logged in but not admin → block /admin
  if (isAdminRoute && token?.role !== "admin") {
    const url = new URL("/?error=access_denied", req.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/library/:path*"],
};
