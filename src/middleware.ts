import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const isAdmin = token?.role === "ADMIN";

    // Log di diagnostica in produzione (ereditato da proxy.ts)
    if (process.env.NODE_ENV === "production" && !pathname.startsWith("/_next")) {
        console.log(`AUTH_DEBUG: [${pathname}] Token: ${!!token}, Role: ${token?.role || 'N/A'}`);
    }

    // 1. Protezione per /admin (Pagine e API)
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (!isAdmin) {
            // Se è un'API, diamo errore 403, se è una pagina facciamo redirect
            if (pathname.startsWith("/api/")) {
                return new NextResponse("Forbidden", { status: 403 });
            }
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // 2. Altre protezioni (ereditate da proxy.ts)
    // Se un utente non loggato prova ad andare in aree protette
    // (withAuth lo manda già al login, ma qui gestiamo casi specifici se servisse)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

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
