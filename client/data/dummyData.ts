import { Conversation, Message } from "@/types/dashboard";

export const dummyConversations: Conversation[] = [
  {
    id: 1,
    title: "Understanding React Hooks",
    date: "2025-10-20",
  },
  {
    id: 2,
    title: "Web Scraping Best Practices",
    date: "2025-10-19",
  },
  {
    id: 3,
    title: "TypeScript Advanced Types",
    date: "2025-10-18",
  },
  {
    id: 4,
    title: "Next.js App Router Guide",
    date: "2025-10-17",
  },
];

export const dummyMessages: Message[] = [
  // Conversation 1: React Hooks
  {
    role: "user",
    content: "Can you explain how useEffect works in React?",
    conversationId: 1,
  },
  {
    role: "assistant",
    content:
      "useEffect is a React Hook that lets you synchronize a component with an external system. It runs after every render by default, but you can control when it runs using the dependency array. The basic syntax is: useEffect(() => { /* your code */ }, [dependencies])",
    conversationId: 1,
  },
  {
    role: "user",
    content: "What about cleanup functions?",
    conversationId: 1,
  },
  {
    role: "assistant",
    content:
      "Great question! You can return a cleanup function from useEffect. This function runs before the component unmounts or before the effect runs again. It's useful for cleaning up subscriptions, timers, or event listeners. Example: useEffect(() => { const timer = setTimeout(...); return () => clearTimeout(timer); }, [])",
    conversationId: 1,
  },

  // Conversation 2: Web Scraping
  {
    role: "user",
    content: "What are the best tools for web scraping?",
    conversationId: 2,
  },
  {
    role: "assistant",
    content:
      "The most popular tools for web scraping are Puppeteer and Playwright for JavaScript/TypeScript. Puppeteer provides a high-level API to control headless Chrome, while Playwright supports multiple browsers (Chromium, Firefox, WebKit) and has better cross-browser testing capabilities.",
    conversationId: 2,
  },
  {
    role: "user",
    content: "How do I handle dynamic content?",
    conversationId: 2,
  },
  {
    role: "assistant",
    content:
      "For dynamic content, you should wait for elements to load before extracting data. Use methods like waitForSelector(), waitForNetworkIdle(), or waitForTimeout(). You can also interact with the page by clicking buttons or triggering events to reveal hidden content.",
    conversationId: 2,
  },

  // Conversation 3: TypeScript
  {
    role: "user",
    content: "What are conditional types in TypeScript?",
    conversationId: 3,
  },
  {
    role: "assistant",
    content:
      "Conditional types allow you to create types that depend on a condition. The syntax is: T extends U ? X : Y. If type T can be assigned to type U, the type resolves to X, otherwise Y. They're powerful for creating flexible, reusable type utilities.",
    conversationId: 3,
  },

  // Conversation 4: Next.js
  {
    role: "user",
    content: "How does the App Router differ from Pages Router?",
    conversationId: 4,
  },
  {
    role: "assistant",
    content:
      "The App Router (Next.js 13+) introduces several key changes: it uses the app/ directory instead of pages/, supports React Server Components by default, has a new file convention (page.tsx, layout.tsx), and provides better data fetching with async components. It's designed to be more flexible and performant than the Pages Router.",
    conversationId: 4,
  },
  {
    role: "user",
    content: "Should I migrate my existing project?",
    conversationId: 4,
  },
  {
    role: "assistant",
    content:
      "It depends on your project. Next.js supports both routers simultaneously, so you can migrate incrementally. If you're starting a new project, use the App Router. For existing projects, migrate when you need the new features or have time for refactoring. The Pages Router is still fully supported.",
    conversationId: 4,
  },
];
