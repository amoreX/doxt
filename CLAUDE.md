# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo containing a Next.js frontend client and an Express TypeScript backend server.

**Structure:**
- `client/` - Next.js 15 application with TypeScript, Tailwind CSS, and shadcn/ui
- `server/` - Express 5 TypeScript server with Supabase integration

## Development Commands

### Client (Next.js)
```bash
cd client
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Server (Express)
```bash
cd server
npm run dev      # Start development server with hot reload (http://localhost:5000)
npm run build    # Compile TypeScript to dist/
npm start        # Run compiled production server
```

## Architecture

### Client Architecture

- **Framework**: Next.js 15 with App Router (React 19)
- **Styling**: Tailwind CSS v4 with shadcn/ui component library configured
- **Path Aliases**: `@/*` maps to the client root directory
- **Component System**:
  - `app/` - Next.js App Router pages and layouts
  - `components/` - React components (currently empty, ready for shadcn/ui components)
  - `lib/utils.ts` - Utility functions including `cn()` for class name merging
- **shadcn/ui Configuration**: Uses "new-york" style with RSC support, configured in `components.json`

### Server Architecture

- **Framework**: Express 5 with TypeScript following MVC pattern
- **Database**: Supabase client configured in `src/utils/supabase.ts`
- **Environment**: Uses dotenv for configuration
- **Folder Structure**:
  ```
  src/
  ├── controllers/         # Minimalist request handlers
  │   ├── auth.controller.ts
  │   ├── scrape.controller.ts
  │   └── ask.controller.ts
  ├── services/            # Business logic (empty templates, ready for implementation)
  │   ├── auth.service.ts
  │   ├── scrape.service.ts
  │   ├── memory.service.ts
  │   └── ask.service.ts
  ├── routes/              # API route definitions
  │   ├── index.ts             # Main router with /health
  │   ├── auth.routes.ts
  │   ├── scrape.routes.ts
  │   └── ask.routes.ts
  ├── utils/
  │   └── supabase.ts          # Supabase client
  └── server.ts            # Express app setup
  ```
- **Architecture Pattern**: Controllers handle HTTP/validation, Services contain business logic (to be implemented)
- Outputs compiled JavaScript to `dist/` directory

### Environment Configuration

**Server requires** (create `server/.env`):
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `PORT` - Server port (defaults to 5000)

### Key API Routes (Server)

- `GET /` - Server status and available endpoints
- `GET /api/health` - Health check endpoint
- **Auth endpoints:**
  - `POST /api/auth/register` - Register new user (body: `{email: string, password: string}`)
  - `POST /api/auth/login` - Login user (body: `{email: string, password: string}`)
  - `POST /api/auth/logout` - Logout user (body: `{userId: string}`)
- **Scrape endpoints:**
  - `POST /api/scrape` - Scrape a URL and store content (body: `{url: string}`)
  - `GET /api/scrape/:id` - Get scrape status/result by ID
- **Ask endpoints:**
  - `POST /api/ask` - Ask a question based on scraped content (body: `{question: string, scrapeId?: string, conversationId?: string}`)
  - `GET /api/ask/history?conversationId=<id>` - Get conversation history

## TypeScript Configuration

- **Client**: Uses `moduleResolution: "bundler"` with Next.js plugin, strict mode enabled
- **Server**: Uses CommonJS (`module: "commonjs"`) targeting ES2020, outputs to `dist/`

## Monorepo Workflow

This is a simple monorepo without a workspace manager. Each package manages its own dependencies independently:

- Install dependencies: Run `npm install` separately in `client/` and `server/` directories
- No root-level package.json - work directly in each package directory
