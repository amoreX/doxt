import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { supabase } from "./supabase";

// Load environment variables from .env file
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Sample route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Express TypeScript server!",
    supabase: supabase ? "Supabase client initialized" : "Supabase client not initialized",
  });
});

// Health check route
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Example route using Supabase (dummy query)
app.get("/api/test", async (req: Request, res: Response) => {
  try {
    // Example: Query a table (this will fail if the table doesn't exist)
    // const { data, error } = await supabase.from("your_table").select("*");

    res.json({
      message: "Supabase client is ready to use",
      note: "Configure your SUPABASE_URL and SUPABASE_ANON_KEY in .env file",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
