import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { supabase } from "./utils/supabase";
import routes from "./routes";

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Express TypeScript server!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      scrape: "/api/scrape",
      ask: "/api/ask",
    },
    supabase: supabase
      ? "Supabase client initialized"
      : "Supabase client not initialized",
  });
});

// Mount API routes
app.use("/api", routes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});

export default app;
