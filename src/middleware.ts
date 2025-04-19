import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin)
  // const path = req.nextUrl.pathname;

  // const session = await getToken({
  //   req,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });

  // const authPath = ["/login", "/register"];

  // if (session) {
  //   if (authPath.includes(path)) {
  //     if (session.role === "admin") {
  //       return NextResponse.redirect(new URL("/admin", req.url));
  //     } else {
  //       return NextResponse.redirect(new URL("/chat", req.url));
  //     }
  //   } else if (path.startsWith("/admin")) {
  //     if (path === "/admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  //     if (session.role === "admin") {
  //       return NextResponse.next();
  //     } else {
  //       return NextResponse.redirect(new URL("/chat", req.url));
  //     }
  //   } else {
  //     if (session.role === "admin") {
  //       return NextResponse.redirect(new URL("/admin", req.url));
  //     }
  //   }
  // } else {
  //   if (path === "/") {
  //     return NextResponse.next();
  //   } else if (!authPath.includes(path)) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  //   return NextResponse.next();
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|images|favicon.ico).*)",
  ],
};
