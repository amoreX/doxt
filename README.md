# Doxt

A full-stack web scraping and context management application with Next.js frontend and Express backend. Scrape multiple URLs in parallel, store content in memory, and interact with your scraped data through conversations.

## Features

- 🌐 **Multi-URL Web Scraping**: Scrape multiple URLs simultaneously with parallel processing
- 💬 **Conversation Management**: Organize scraped content into conversations with Zustand state management
- 🤖 **Smart Scraping**: Uses Puppeteer for reliable content extraction and cleaning
- 📦 **Context Storage**: Automatically saves cleaned content to memory/vector database
- ⚡ **Real-time Feedback**: See which URLs succeeded or failed with detailed error messages
- 🎨 **Modern UI**: Beautiful glassmorphism design with Framer Motion animations

## Tech Stack

**Client:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zustand (state management)
- Framer Motion (animations)
- Phosphor Icons
- Axios

**Server:**
- Express 5
- TypeScript
- Supabase (database)
- Puppeteer (web scraping)
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

## Project Structure

```
doxt/
├── client/                 # Next.js frontend
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── store/            # Zustand state management
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── data/             # Dummy/fixture data
├── server/                # Express backend
│   └── src/
│       ├── controllers/  # Request handlers
│       ├── services/     # Business logic
│       ├── routes/       # API routes
│       └── utils/        # Helper functions
└── CLAUDE.md            # Detailed documentation
```

## Key API Endpoints

### Scraping
- **`POST /api/scrape`** - Scrape multiple URLs in parallel
  - Body: `{ url: string[] }`
  - Returns: Success/failure lists with counts and error details

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Context & Questions
- `POST /api/ask` - Ask questions about scraped content
- `GET /api/ask/history` - Get conversation history

### Health
- `GET /api/health` - Health check endpoint

## Documentation

For detailed documentation including architecture, state management, scraping pipeline, and API specifications, see [CLAUDE.md](./CLAUDE.md).
