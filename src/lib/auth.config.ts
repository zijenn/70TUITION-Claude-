import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

// Edge-safe subset of the auth config — no Prisma-touching providers here.
// Used directly by middleware.ts (which runs on the Edge runtime) and spread
// into the full config in auth.ts.
const PROTECTED_PREFIXES = ["/messages", "/tutors/new"];

export const authConfig = {
  providers: [],
  pages: {},
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isProtected = PROTECTED_PREFIXES.some((p) => nextUrl.pathname.startsWith(p));
      if (isProtected && !isLoggedIn) {
        const url = new URL("/", nextUrl);
        url.searchParams.set("login", "1");
        url.searchParams.set("next", nextUrl.pathname);
        return NextResponse.redirect(url);
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
