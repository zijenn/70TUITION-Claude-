import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// A separate, edge-safe NextAuth instance built only from the Prisma-free
// config, used purely for its `authorized` callback (JWT verification only,
// no DB access) so it can run in Edge middleware.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/messages/:path*", "/tutors/new", "/students/new"],
};
