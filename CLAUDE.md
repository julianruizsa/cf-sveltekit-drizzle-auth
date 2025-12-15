# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Build and preview with Wrangler
npm run check        # Type-check with svelte-check
npm run deploy       # Build and deploy to Cloudflare

# Database (requires DATABASE_URL env var)
npm run db:push      # Push schema to database
npm run db:generate  # Generate migrations
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio
npm run cf-typegen   # Generate Cloudflare types
```

## Architecture

This is a SvelteKit 2 + Svelte 5 guestbook app deployed to Cloudflare Workers with D1 database.

### Tech Stack
- **Framework**: SvelteKit 2 with Svelte 5 (uses runes: `$state`, `$derived`, etc.)
- **Database**: Cloudflare D1 (production) / libSQL (local dev)
- **ORM**: Drizzle ORM with SQLite dialect
- **Auth**: BetterAuth with email/password and Google OAuth

### Key Patterns

**Database Access**: The database client is created dynamically in `hooks.server.ts` and attached to `event.locals.db`. It supports both D1 (production via `platform.env.DB`) and libSQL (local dev via `DATABASE_URL`).

**Authentication**: Auth is initialized per-request in `hooks.server.ts` via `getAuth(db)` and stored in `event.locals.auth`. Protected routes (`/app`, `/login`, `/register`) are handled in the hook with automatic redirects.

**Schema Location**: All Drizzle schemas live in `src/lib/server/db/`:
- `better-auth-schema.ts` - BetterAuth tables (user, session, account, verification)
- `schema.ts` - App tables (guestbook_messages) + re-exports auth schema

**Client Auth**: Use `authClient` from `$lib/auth-client` for client-side auth operations (signIn, signUp, signOut).

### Route Structure
- `/` - Public landing page
- `/login`, `/register` - Auth pages (redirect to /app if logged in)
- `/app` - Protected app page (redirect to /login if not logged in)
- `/api/auth/*` - BetterAuth API endpoints (handled by svelteKitHandler)

### Environment
- `DATABASE_URL` - Local SQLite database path for development
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- Cloudflare bindings: `DB` (D1 database), `ASSETS` (static files)
