# SvelteKit + BetterAuth + Drizzle + Cloudflare D1 Template

A production-ready template for building full-stack applications with SvelteKit 2, Svelte 5, BetterAuth authentication, Drizzle ORM, and Cloudflare D1 (SQLite).

## Features

- **SvelteKit 2** with **Svelte 5** (runes, snippets, and new reactivity system)
- **BetterAuth** for authentication (email/password + Google OAuth)
- **Drizzle ORM** with type-safe database queries
- **Cloudflare D1** as the production SQLite database
- **libSQL** for local development
- **TypeScript** with strict mode
- Protected routes with automatic redirects
- Server-side session validation

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [SvelteKit 2](https://svelte.dev/docs/kit) | Full-stack framework |
| [Svelte 5](https://svelte.dev/docs/svelte) | UI framework with runes |
| [BetterAuth](https://www.better-auth.com/) | Authentication library |
| [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL ORM |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) | Serverless SQLite database |
| [Cloudflare Workers](https://workers.cloudflare.com/) | Edge deployment platform |

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) or your preferred package manager
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)
- [Cloudflare account](https://dash.cloudflare.com/sign-up) (for deployment)

## Getting Started

### Clone and Start Fresh

To use this as a template for your own project (removing git history):

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sveltekit-guestbook.git my-app

# Navigate to the project
cd my-app

# Remove the existing git history
rm -rf .git

# Initialize a fresh git repository
git init

# Install dependencies
npm install

# Make your first commit
git add .
git commit -m "Initial commit from template"
```

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Configure your environment variables in `.env`:

```env
# Local SQLite database path (for development)
DATABASE_URL=file:local.db

# BetterAuth configuration
BETTER_AUTH_URL=http://localhost:5173
BETTER_AUTH_SECRET="your-secure-secret-here"

# Google OAuth (optional - remove from auth.ts if not using)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Note**: Generate a secure secret for `BETTER_AUTH_SECRET` using `openssl rand -base64 32`

### Google OAuth Setup (Optional)

If you want to use Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** > **Create Credentials** > **OAuth Client ID**
5. Set authorized redirect URI to: `http://localhost:5173/api/auth/callback/google` (development)
6. Copy the Client ID and Client Secret to your `.env` file

If you don't need Google OAuth, remove the `socialProviders` section from `src/lib/auth.ts`.

## Database Setup

This template uses Drizzle ORM with two database configurations:
- **Local development**: libSQL (file-based SQLite)
- **Production**: Cloudflare D1

### Schema Location

Database schemas are defined in `src/lib/server/db/`:
- `better-auth-schema.ts` - Authentication tables (user, session, account, verification)
- `schema.ts` - Your application tables + re-exports auth schema

### Local Development Database

1. **Generate migrations** from your schema:

```bash
npm run db:generate
```

2. **Push schema directly** to local database (development only):

```bash
npm run db:push
```

3. **Run migrations** against local database:

```bash
npm run db:migrate
```

4. **Open Drizzle Studio** to browse your data:

```bash
npm run db:studio
```

### Cloudflare D1 Setup

1. **Login to Cloudflare**:

```bash
wrangler login
```

2. **Create a D1 database**:

```bash
wrangler d1 create your-database-name
```

3. **Update `wrangler.jsonc`** with your database ID:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "your-database-name",
      "database_id": "your-database-id-from-step-2",
      "migrations_dir": "./src/lib/server/db/migrations"
    }
  ]
}
```

4. **Generate Cloudflare types**:

```bash
npm run cf-typegen
```

### D1 Migrations

#### Generate a New Migration

After modifying your schema files:

```bash
npm run db:generate
```

This creates a new SQL migration file in `src/lib/server/db/migrations/`.

#### Apply Migrations Locally (D1 Local)

To test migrations with Wrangler's local D1 emulator:

```bash
wrangler d1 migrations apply your-database-name --local
```

#### Apply Migrations to Production (Remote D1)

To apply migrations to your production Cloudflare D1 database:

```bash
wrangler d1 migrations apply your-database-name --remote
```

#### List Applied Migrations

```bash
# Local
wrangler d1 migrations list your-database-name --local

# Remote
wrangler d1 migrations list your-database-name --remote
```

#### Execute Raw SQL

```bash
# Local
wrangler d1 execute your-database-name --local --command "SELECT * FROM user"

# Remote
wrangler d1 execute your-database-name --remote --command "SELECT * FROM user"
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Build and preview with Wrangler |
| `npm run check` | Type-check the project |
| `npm run check:watch` | Type-check in watch mode |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npm run cf-typegen` | Generate Cloudflare binding types |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push schema to local database |
| `npm run db:migrate` | Run migrations on local database |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── app.d.ts                 # TypeScript declarations (App.Locals, Platform)
├── hooks.server.ts          # Server hooks (auth, db initialization, route protection)
├── lib/
│   ├── auth.ts              # BetterAuth server configuration
│   ├── auth-client.ts       # BetterAuth client for browser
│   ├── components/          # Svelte components
│   └── server/
│       └── db/
│           ├── index.ts             # Database client factory
│           ├── schema.ts            # App database schema
│           ├── better-auth-schema.ts # Auth tables schema
│           └── migrations/          # SQL migration files
└── routes/
    ├── +layout.svelte       # Root layout
    ├── +page.svelte         # Landing page (public)
    ├── login/               # Login page (redirects if authenticated)
    ├── register/            # Registration page (redirects if authenticated)
    └── app/                 # Protected app pages (requires authentication)
```

## Authentication Flow

### Route Protection

Routes are protected in `hooks.server.ts`:

- `/app/*` - Requires authentication (redirects to `/login` if not logged in)
- `/login`, `/register` - Redirects to `/app` if already logged in
- All other routes - Public

### Using Authentication

**Server-side** (in `+page.server.ts` or `+server.ts`):

```typescript
export const load: PageServerLoad = async ({ locals }) => {
  // Access the authenticated user
  const user = locals.user;

  // Access the database
  const data = await locals.db.select().from(myTable);

  return { user, data };
};
```

**Client-side** (in `.svelte` files):

```svelte
<script lang="ts">
  import { authClient } from "$lib/auth-client";

  // Sign up
  async function register() {
    await authClient.signUp.email({
      name: "John Doe",
      email: "john@example.com",
      password: "securepassword",
      callbackURL: "/app"
    });
  }

  // Sign in with email
  async function login() {
    await authClient.signIn.email({
      email: "john@example.com",
      password: "securepassword",
      callbackURL: "/app"
    });
  }

  // Sign in with Google
  async function loginWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/app"
    });
  }

  // Sign out
  async function logout() {
    await authClient.signOut();
  }
</script>
```

## Deployment

### Deploy to Cloudflare

1. **Ensure migrations are applied** to production D1:

```bash
wrangler d1 migrations apply your-database-name --remote
```

2. **Set production secrets**:

```bash
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put GOOGLE_CLIENT_ID      # if using Google OAuth
wrangler secret put GOOGLE_CLIENT_SECRET  # if using Google OAuth
```

3. **Deploy**:

```bash
npm run deploy
```

### Environment Variables for Production

Set these secrets in Cloudflare (do NOT commit to git):

| Secret | Description |
|--------|-------------|
| `BETTER_AUTH_SECRET` | Secure random string for session encryption |
| `BETTER_AUTH_URL` | Your production URL (e.g., `https://myapp.workers.dev`) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (if using) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (if using) |

## Adding New Database Tables

1. **Define your schema** in `src/lib/server/db/schema.ts`:

```typescript
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer().primaryKey(),
  title: text().notNull(),
  content: text().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});
```

2. **Generate migration**:

```bash
npm run db:generate
```

3. **Apply migration locally**:

```bash
npm run db:push
# or
wrangler d1 migrations apply your-database-name --local
```

4. **Apply migration to production** (before deploying):

```bash
wrangler d1 migrations apply your-database-name --remote
```

## Resources

### Video Tutorials

- [SvelteKit + Cloudflare D1 Tutorial](https://www.youtube.com/watch?v=zIvGs0FOMvA)
- [BetterAuth with SvelteKit Tutorial](https://www.youtube.com/watch?v=ZZaExhqW5II)

## Troubleshooting

### "no database configuration found" error

Ensure your `.env` file has `DATABASE_URL` set for local development.

### Migrations not applying

- Check that migration files exist in `src/lib/server/db/migrations/`
- Verify the `migrations_dir` path in `wrangler.jsonc` is correct

### Type errors after schema changes

Run `npm run cf-typegen` to regenerate Cloudflare types, then `npm run check` to verify.

## License

MIT
