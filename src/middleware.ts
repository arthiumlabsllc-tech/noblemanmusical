import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/shop",
  "/product",
  "/search",
  "/about",
  "/contact",
  "/churches",
  "/radio-stations",
  "/schools",
  "/blog",
  "/login",
  "/register",
  "/forgot-password",
  "/checkout",
  "/cart",
  "/order-tracking",
  "/api/auth",
];

const adminRoutes = ["/admin"];

export default async function middleware(request: Request) {
  const { pathname } = new URL(request.url);
  const session = await auth();

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Static assets and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".ico") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Protect /admin/* routes
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = session.user?.role;
    if (role !== "admin" && role !== "staff") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  // Protect /account/* routes
  if (pathname.startsWith("/account")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public files (images, icons)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)",
  ],
};
