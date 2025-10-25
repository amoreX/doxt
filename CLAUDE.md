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
- **Styling**: Tailwind CSS v4 (using `@import "tailwindcss"`)
- **State Management**: Zustand for global state management
- **UI Libraries**:
  - Phosphor Icons (`@phosphor-icons/react`) for iconography
  - Framer Motion for animations
- **Path Aliases**: `@/*` maps to the client root directory
- **Component System**:
  - `app/` - Next.js App Router pages and layouts
    - `page.tsx` - Landing page with loader that redirects to auth/dashboard
    - `auth/page.tsx` - Authentication page with sign in/sign up
    - `dashboard/page.tsx` - Main dashboard orchestrating all dashboard components
  - `components/` - React components organized by feature
    - `loader.tsx` - Animated loading screen with muted slate colors
    - `dashboard/` - Dashboard-specific components
      - `Sidebar.tsx` - Collapsible sidebar with conversation history and New Chat button
      - `Header.tsx` - Header with sidebar toggle and profile dropdown
      - `ProfileDropdown.tsx` - User profile dropdown with settings and sign out
      - `ChatArea.tsx` - Message display area or EmptyState when no messages
      - `EmptyState.tsx` - Dynamic greeting with rotating phrases (extracted component)
      - `ChatInput.tsx` - Message input orchestrating URL attachment and scraping
      - `UrlInput.tsx` - URL input form with add/remove functionality (controlled component)
      - `BackgroundParticles.tsx` - Soothing background animations with particles, orbs, and lines
  - `store/` - Zustand state management
    - `conversationsStore.ts` - Global conversation and message state management
  - `data/` - Static data and fixtures
    - `dummyData.ts` - Sample conversations and messages for development
  - `types/` - TypeScript type definitions
    - `dashboard.ts` - All dashboard-related interfaces (Message, Conversation, component props)
  - `utils/` - Utility functions
    - `conversationUtils.ts` - Conversation creation and formatting utilities
  - `lib/utils.ts` - Utility functions including `cn()` for class name merging

**Design System**:
- **Color Scheme**: Muted slate/grey tones with dark accents (slate-800 for primary actions)
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Layout**: Glassmorphism design with backdrop-blur effects and semi-transparent backgrounds

**Routing & Authentication**:
- Landing page (`/`) - Shows loader animation, then redirects based on localStorage authentication
- Auth page (`/auth`) - Sign in/sign up interface with social login options (dummy implementation)
- Dashboard page (`/dashboard`) - Main application interface (requires authentication)
- Authentication uses localStorage for testing (key: "isAuthenticated")

**State Management (Zustand)**:
- **Conversations Store** (`store/conversationsStore.ts`):
  - Global state for conversations, messages, and current conversation
  - State structure:
    - `conversations: Conversation[]` - All conversations
    - `currentConversationId: number | null` - Active conversation (-1 = new chat)
    - `allMessages: Message[]` - Global message store
    - `messages: Message[]` - Filtered messages for current conversation
  - Actions:
    - `addConversation(conversation)` - Add new conversation to store
    - `deleteConversation(id)` - Remove conversation and its messages
    - `setCurrentConversation(id)` - Switch conversation and filter messages
    - `addMessage(message)` - Add message with conversationId to store
    - `clearMessages()` - Clear current conversation messages
  - Message structure includes `conversationId` field for filtering
  - Initial state loads dummy data from `data/dummyData.ts`

**Conversation Management**:
- **New Conversation Flow**:
  - Default `currentConversationId` is `-1` (indicates new conversation)
  - First message or URL scrape creates new conversation automatically
  - Auto-generates ID: `max(existing IDs) + 1`
  - Title generated from first message (50 chars) or scraped URL (40 chars)
  - Conversation added to sidebar and immediately selected
- **Utilities** (`utils/conversationUtils.ts`):
  - `generateConversationId(conversations)` - Get next available ID
  - `createConversation(conversations, title)` - Create conversation with ID and date
  - `createTitleFromMessage(message)` - Generate title from text (50 char limit)
  - `createTitleFromUrl(url)` - Generate title from single URL (40 char limit, prefixed "Scraped:")
  - `formatScrapedData(url, data)` - Format single URL scrape success (legacy, simplified)
  - `formatScrapeResponse(response)` - Format multiple URL scrape results with success/failure lists

**Key UI Features**:
1. **Dynamic Empty State**:
   - Format: "Hi, how can Doxt **help you** [rotating phrase] **today?**"
   - "help you" and "today?" are static badges with slate-900 background
   - Rotating phrases every 3 seconds: "summarize pages", "analyze content", "extract insights", "answer queries"
   - Smooth fade animations using Framer Motion for phrase transitions
   - Layout animations for position adjustments (0.6s easeInOut)
   - "today?" badge smoothly slides left/right as phrase length changes

2. **Message System**:
   - User messages: Dark slate-800 background with white text
   - Assistant messages: White/transparent background with slate-800 text
   - Smooth slide-up animations with staggered delays
   - Messages animate in individually
   - Each message has `conversationId` field for filtering

3. **URL Attachment & Scraping**:
   - **Multi-URL Support**: Add unlimited URLs before scraping
   - Click link button to show URL input form
   - Input stays open after adding URL - allows continuous URL entry
   - Press Enter or click "Add" to add URL to list
   - Click "Done" to close input form
   - Each URL shown as badge with remove button (X)
   - Duplicate URLs automatically prevented
   - "Add to context" button triggers parallel scraping of ALL URLs
   - Creates new conversation if in "new chat" mode (conversationId = -1)
   - **Conversation title generation**:
     - Single URL: `"Scraped: [first 40 chars of URL]..."`
     - Multiple URLs: `"Scraped: 3 URLs"`
   - **Backend Integration**:
     - Sends URLs as array to `POST /api/scrape`
     - Backend processes all URLs in parallel using `Promise.allSettled()`
     - Each URL: scrape → clean → add to memory (via `scrape2save`)
     - Failures don't block other URLs
   - **Response Display**: Shows formatted summary as assistant message:
     - ✅ All successful: `"All N URLs successfully added to context!"`
     - ⚠️ Partial success: `"Partial Success: X succeeded, Y failed"` with lists
     - ❌ All failed: `"All URLs failed to scrape"` with error details
     - Lists successful URLs and failed URLs with error messages
   - Smooth height/scale animations for adding/removing URLs
   - Uses AnimatePresence for exit animations

4. **Background Animations**:
   - BackgroundParticles component with three animation types:
     - 20 floating particles with random positions, sizes, and durations
     - 2 gradient orbs with pulsing scale/opacity animations
     - 2 animated SVG lines with pathLength animations
   - Particles generated client-side only (useEffect) to avoid hydration errors
   - Positioned at z-0 behind dashboard content with pointer-events-none
   - Returns null during SSR to prevent hydration mismatch
   - Background gradient only on root container, nested elements transparent

5. **Sidebar**:
   - Collapsible with smooth width transitions
   - Shows conversation history with active state highlighting
   - New Chat button (slate-800 background) - sets conversationId to -1
   - Click conversation to switch and load its messages
   - Opens/closes from left side

6. **Profile Dropdown**:
   - Click avatar to open dropdown
   - Profile, Settings, and Sign Out options
   - Sign out clears localStorage and redirects to /auth

### Server Architecture

- **Framework**: Express 5 with TypeScript following MVC pattern
- **Database**: Supabase client configured in `src/utils/supabase.ts`
- **Environment**: Uses dotenv for configuration
- **Middleware**: JSON parsing, URL-encoded body parsing, Morgan logging
- **Folder Structure**:
  ```
  src/
  ├── controllers/         # Minimalist request handlers (HTTP/validation only)
  │   ├── auth.controller.ts      # Auth: registerUser, loginUser, logoutUser
  │   ├── scrape.controller.ts    # Scraping: scrapeUrl, getScrapeStatus
  │   └── ask.controller.ts       # AI: askQuestion, getConversationHistory
  ├── services/            # Business logic
  │   ├── auth.service.ts         # register, login, logout, verifyToken (empty template)
  │   ├── scrape.service.ts       # scrapeWebpage, getScrapedData (IMPLEMENTED with Puppeteer + Playwright)
  │   ├── memory.service.ts       # storeInMemory, searchMemory, getFromMemory, deleteFromMemory (empty template)
  │   └── ask.service.ts          # processQuestion, getHistory (empty template)
  ├── routes/              # API route definitions
  │   ├── index.ts                # Main router with /health endpoint
  │   ├── auth.routes.ts          # /register, /login, /logout
  │   ├── scrape.routes.ts        # POST /, GET /:id
  │   └── ask.routes.ts           # POST /, GET /history
  ├── utils/
  │   ├── supabase.ts             # Supabase client initialization
  │   ├── scrapeCleaner.ts        # HTML cleaning, text extraction, link parsing
  │   ├── puppeteerScraper.ts     # Puppeteer scraping implementation
  │   ├── playwrightScraper.ts    # Playwright scraping with interaction simulation
  │   └── addingToMemory.ts       # Memory/vector database integration
  └── server.ts                   # Express app setup, middleware, route mounting
  ```

### Architecture Pattern

- **Controllers**: Handle HTTP requests/responses and input validation only
- **Services**: Contain business logic (currently empty templates with `throw new Error("Not implemented")`)
- **Routes**: Define API endpoints and map to controller functions
- **Separation**: Clear separation between HTTP layer (controllers) and business logic (services)

### Service Implementation Notes

Most service files are **empty templates** ready for implementation:
- Each function throws `"Not implemented"` error
- TODO comments indicate what needs to be implemented
- Controllers are already wired to call these services
- Implement service logic without touching controllers

**Scraping Service** (`scrape.service.ts`) - **FULLY IMPLEMENTED**:

1. **`scrapeWebpage(urls: string[])`** - Scrapes multiple URLs in parallel
   - **Input**: Array of URL strings
   - **Process**: Maps each URL to `scrape2save()` function
   - Uses `Promise.allSettled()` to run all scraping operations in parallel
   - Each URL independently: scrapes → cleans → saves to memory
   - Individual failures don't affect other URLs
   - **Returns**: `ScrapeResult` interface:
     ```typescript
     {
       successful: string[],                        // List of successfully scraped URLs
       failed: Array<{ url: string, error: string }>, // Failed URLs with error details
       successCount: number,
       failCount: number
     }
     ```
   - Comprehensive logging with emojis (✅ success, ❌ failure)

2. **`scrape2save(url: string)`** - Scrapes, cleans, and saves a single URL
   - Scrapes with Puppeteer using `scrapeWithPuppeteer()`
   - Cleans HTML using `cleanScrapedData()` from `utils/scrapeCleaner.ts`
   - Saves to memory using `addToMemory()` from `utils/addingToMemory.ts`
   - Throws error on failure (caught by `scrapeWebpage`)
   - Used internally by `scrapeWebpage()` for each URL

3. **`getScrapedData(id: string)`** - Empty template (not yet implemented)
   - Should retrieve scraped content by ID from storage

**Scraping Utilities**:

- **`puppeteerScraper.ts`**:
  - Exports `scrapeWithPuppeteer(url)`
  - Launches headless Chromium with Puppeteer
  - Waits for network idle before extracting HTML

- **`playwrightScraper.ts`**:
  - Exports `scrapeWithPlaywright(url)`
  - Launches headless Chromium with Playwright
  - Clicks all `[role="button"]` elements to trigger dropdowns/modals
  - Opens all `<details>` elements to reveal hidden content
  - Waits 2 seconds after interactions before extracting HTML

- **`scrapeCleaner.ts`**:
  - Exports `cleanScrapedData(html, baseUrl)` - Main cleaning function
  - Extracts title, meta description, text content, and all links
  - Returns `CleanedContent` interface with metadata (word count, link count)

  **Cleaning Pipeline**:
  1. Extract title from `<title>` tag
  2. Extract meta description from `<meta name="description">`
  3. Remove `<script>`, `<style>`, `<noscript>`, `<svg>`, HTML comments
  4. Remove elements with `aria-hidden="true"` or `display:none`/`visibility:hidden`
  5. Extract and normalize all links (relative to absolute URLs)
  6. Remove all HTML tags
  7. Decode HTML entities (`&nbsp;`, `&amp;`, etc.)
  8. **Remove hidden content**:
     - Zero-width characters (U+200B-U+200D, U+FEFF)
     - Invisible Unicode characters
     - Control characters
     - Suspicious numeric sequences: "1 2 3 4 5", "0 11 12 13 14 15 16 17 18 19 20"
     - Bullet-number patterns: "• 1 • 2 • 3"
     - Tab list markers and ARIA label artifacts
  9. Clean whitespace (collapse multiple spaces, remove empty lines)
  10. Count words

  **Additional Exports**:
  - `extractLinks(html, baseUrl)` - Extract all `<a href>` links (skips javascript:, mailto:, tel:, #)
  - `extractMainContent(html)` - Remove headers, footers, nav, aside (heuristic-based)
  - `getSummary(text, maxLength)` - Get first N characters, cut at sentence boundary

**Integration Notes**:
- Scraping service is ready to use for web scraping tasks
- Still needs integration with `memory.service.ts` for persistent storage
- Expected to work with `ask.service.ts` for AI-powered Q&A on scraped content

- Outputs compiled JavaScript to `dist/` directory

### Environment Configuration

**Server requires** (create `server/.env`):
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `PORT` - Server port (defaults to 5000)

### Key API Routes (Server)

- `GET /` - Simple status message: "Welcome to the Doxt server! App is live."
- `GET /api/health` - Health check endpoint (returns status and timestamp)

**Auth endpoints (`/api/auth`):**
- `POST /api/auth/register` - Register new user
  - Body: `{email: string, password: string}`
  - Controller validates input, calls `auth.service.register()`
- `POST /api/auth/login` - Login user
  - Body: `{email: string, password: string}`
  - Controller validates input, calls `auth.service.login()`
- `POST /api/auth/logout` - Logout user
  - Body: `{userId: string}`
  - Controller validates input, calls `auth.service.logout()`

**Scrape endpoints (`/api/scrape`):**
- `POST /api/scrape` - Scrape multiple URLs in parallel
  - **Body**: `{url: string[]}` - Array of URL strings (required)
  - **Validation**:
    - `url` must be provided
    - `url` must be an array
    - Array cannot be empty
  - **Controller** (`scrape.controller.ts`):
    - Validates input format
    - Calls `scrape.service.scrapeWebpage(urls)`
    - Returns comprehensive result object
  - **Response**:
    ```typescript
    {
      message: "Scraping completed",
      successful: ["url1", "url2"],              // Successfully scraped URLs
      failed: [                                  // Failed URLs with errors
        { url: "url3", error: "Network timeout" }
      ],
      successCount: 2,                           // Count of successful scrapes
      failCount: 1                               // Count of failed scrapes
    }
    ```
  - **Status Codes**:
    - `201` - Scraping completed (check `successCount`/`failCount` for details)
    - `400` - Invalid request (missing/invalid URL parameter)
    - `500` - Server error
  - **Behavior**:
    - All URLs processed in parallel asynchronously
    - Individual URL failures don't affect others
    - Each URL: scraped with Puppeteer → cleaned → saved to memory

- `GET /api/scrape/:id` - Get scrape status/result by ID (not yet implemented)
  - Params: `id` (scrape identifier)
  - Controller calls `scrape.service.getScrapedData(id)`
  - Returns scraped content or error if not found

**Ask endpoints (`/api/ask`):**
- `POST /api/ask` - Ask a question based on scraped content
  - Body: `{question: string, scrapeId?: string, conversationId?: string}`
  - Controller validates question, calls `ask.service.processQuestion()`
  - Expected to search memory for relevant context and use LLM
- `GET /api/ask/history` - Get conversation history
  - Query: `?conversationId=<id>`
  - Controller validates conversationId, calls `ask.service.getHistory()`

## TypeScript Configuration

- **Client**: Uses `moduleResolution: "bundler"` with Next.js plugin, strict mode enabled
- **Server**: Uses CommonJS (`module: "commonjs"`) targeting ES2020, outputs to `dist/`

## Monorepo Workflow

This is a simple monorepo without a workspace manager. Each package manages its own dependencies independently:

- Install dependencies: Run `npm install` separately in `client/` and `server/` directories
- No root-level package.json - work directly in each package directory
