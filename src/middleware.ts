import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/config";
import { canAccessRoute } from "@/lib/auth/permissions";

const { auth: middleware, auth } = NextAuth(authConfig);

export default middleware(async (req) => {
  const { pathname } = req.nextUrl;

  // Skip auth for static assets, API routes, and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/test") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Check if route requires protection
  const isProtected = pathname.startsWith("/admin") || pathname.startsWith("/pos");

  if (!isProtected) {
    return;
  }

  const session = await auth();

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(loginUrl);
  }

  const role = session.user.role;
  if (!canAccessRoute(role, pathname)) {
    return Response.redirect(new URL("/unauthorized", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|robots.txt|sitemap.xml).*)",
  ],
};
