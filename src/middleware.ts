import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const isAdmin = token?.role === "ADMIN";

    // 1. Protezione Rigida Area Admin
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        if (!isAdmin) {
            // Se è un'API admin, errore 403 (Forbidden)
            if (pathname.startsWith("/api/")) {
                return new NextResponse("Forbidden", { status: 403 });
            }
            // Se è una pagina admin, redirect in Home
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    // Per le altre rotte in matcher (/team, /account), withAuth 
    // gestisce già il redirect al login se il token manca.
    return NextResponse.next();
  },
  {
    callbacks: {
      // authorized decide se chiamare la funzione middleware sopra.
      // Se ritorna false, Next-Auth reindirizza alla pagina di login.
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        
        // Se è l'area admin, richiediamo sempre il token qui, 
        // la logica del ruolo la gestiamo nel middleware sopra.
        if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
            return !!token;
        }

        // Per team e account, servirebbe il login, ma se vogliamo che 
        // la home sia sempre libera, non dobbiamo bloccarla qui.
        // Visto che il matcher è specifico, questo callback gira solo per quelle rotte.
        return !!token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
);

export const config = {
  matcher: [
    // Proteggiamo solo le rotte che richiedono autenticazione
    "/admin/:path*",
    "/api/admin/:path*",
    "/team/:path*",
    "/account/:path*",
    "/team",
    "/account"
  ],
};
