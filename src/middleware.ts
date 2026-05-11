import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // 1. Identifichiamo le zone protette
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isUserPath = pathname.startsWith("/team") || pathname.startsWith("/account");

  // Se la rotta non è tra quelle protette, passiamo oltre immediatamente (massima velocità)
  if (!isAdminPath && !isUserPath) {
    return NextResponse.next();
  }

  // 2. Recuperiamo la sessione (token JWT)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 3. Se l'utente non è loggato
  if (!token) {
    // Per le API restituiamo un errore pulito
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Per le pagine facciamo il redirect al login, salvando la pagina di provenienza
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Se è un'area Admin ma l'utente non ha i permessi
  if (isAdminPath && token.role !== "ADMIN") {
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Se tutto è in regola, procediamo
  return NextResponse.next();
}

// Definiamo esattamente dove deve attivarsi il middleware per non sprecare risorse
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
