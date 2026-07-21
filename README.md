# 70 Tuition

A Next.js rebuild of the `70tuition.html` prototype (kept in the repo root for reference) — same visual design, backed by a real Postgres database and real auth (email/password + Google OAuth).

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Prisma** + **PostgreSQL** (Neon or Supabase free tier)
- **Auth.js (NextAuth v5)** — Credentials (email/password) + Google OAuth
- Plain CSS (ported verbatim from the prototype) + `next/font/google`

## 1. Prerequisites

- **Node.js 20+** and npm.
- A **Postgres database** — create a free project at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
- A **Google OAuth client** — from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials):
  1. Create (or pick) a project → **APIs & Services → Credentials → Create Credentials → OAuth client ID**.
  2. Application type: **Web application**.
  3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google` (add your production URL's equivalent later).
  4. Copy the generated **Client ID** and **Client secret**.

## 2. Configure environment

Copy `.env.example` to `.env` and fill in:

```
DATABASE_URL=...      # Neon/Supabase pooled connection string
DIRECT_URL=...        # Neon/Supabase direct (unpooled) connection string
AUTH_SECRET=...        # generate with: npx auth secret
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_URL=http://localhost:3000
```

- **Neon**: the pooled string uses the `-pooler` host; the direct string is the same host without `-pooler`.
- **Supabase**: the pooled string uses port `6543` (pgbouncer); the direct string uses port `5432`.

## 3. Install, migrate, seed

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
```

The seed script recreates the prototype's 5 tutors, 5 students and 3 centers as real accounts. Every seeded account uses the password `Demo1234!` (see `prisma/seed.ts`) — useful for testing login, editing a profile, liking, and messaging between two seeded accounts. This is dev-only; never reuse this seed against a production database with real users.

## 4. Run

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Notes on scope

- Likes are per-user and persisted (unlike the prototype's client-only `likedIds`, which reset on every refresh).
- "+ Shortlist" in the profile modal reuses the same like mechanism as the card's like button.
- "Post yourself" is a real form at `/tutors/new` and `/students/new` (one profile per account); submitting again edits your existing profile. Centers have no self-serve creation UI, matching the prototype (no "+ Post" button there).
- Messaging is a simple direct-message system between two accounts (`/messages`, `/messages/[userId]`) — no group chats or read receipts beyond a single unread flag.
- `/messages`, `/tutors/new`, and `/students/new` are gated by `middleware.ts`; a signed-out visit redirects to `/?login=1`, which auto-opens the same login modal used elsewhere in the app (not a generic Auth.js page).
