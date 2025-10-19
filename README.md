# Doxt

A full-stack monorepo with Next.js frontend and Express backend.

## Tech Stack

**Client:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui

**Server:**
- Express 5
- TypeScript
- Supabase
- Morgan (logging)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doxt
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:

Create `server/.env`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5000
```

### Running the Application

**Development mode:**

Open two terminal windows:

Terminal 1 - Run the client:
```bash
cd client
npm run dev
```
Client will run on http://localhost:3000

Terminal 2 - Run the server:
```bash
cd server
npm run dev
```
Server will run on http://localhost:5000

## API Endpoints

- **Health:** `GET /api/health`
- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **Scrape:** `POST /api/scrape`, `GET /api/scrape/:id`
- **Ask:** `POST /api/ask`, `GET /api/ask/history`
