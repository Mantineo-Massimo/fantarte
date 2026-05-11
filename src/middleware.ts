import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // 1. Definiamo le rotte che richiedono protezione
  const isAdminPath = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isUserPath = pathname.startsWith("/team") || pathname.startsWith("/account");

  // Se non è una rotta protetta, lasciamo passare subito senza nemmeno controllare il token
  if (!isAdminPath && !isUserPath) {
    return NextResponse.next();
  }

  // 2. Recuperiamo il token (sessione)
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // 3. Logica di protezione
  if (!token) {
    // Se è un'API, 401 Unauthorized
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Se è una pagina, redirect al login
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Protezione specifica Admin
  if (isAdminPath && token.role !== "ADMIN") {
    if (pathname.startsWith("/api/")) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Configurazione matcher per ottimizzare le performance
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
