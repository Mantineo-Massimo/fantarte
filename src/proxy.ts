import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Zone protette
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isUserPath = pathname.startsWith("/team") || pathname.startsWith("/account");

  // Bypass immediato per tutto il resto
  if (!isAdminPath && !isUserPath) {
    return NextResponse.next();
  }

  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && token.role !== "ADMIN") {
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/team/:path*",
    "/account/:path*",
    "/team",
    "/account"
  ],
};
