import { Router } from "express";
import scrapeRoutes from "./scrape.routes";
import askRoutes from "./ask.routes";
import authRoutes from "./auth.routes";

const router = Router();

// Health check route
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Mount routes
router.use("/auth", authRoutes);
router.use("/scrape", scrapeRoutes);
router.use("/ask", askRoutes);

export default router;
