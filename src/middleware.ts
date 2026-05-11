import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const pathname = req.nextUrl.pathname;

    // Se sta cercando di andare in /admin ma non è admin, lo rispediamo in home
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protezione extra per le API admin
    if (pathname.startsWith("/api/admin") && !isAdmin) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
