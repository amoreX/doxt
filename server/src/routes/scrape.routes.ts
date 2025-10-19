import { Router } from "express";
import { scrapeUrl, getScrapeStatus } from "../controllers/scrape.controller";

const router = Router();

// POST /api/scrape - Scrape a URL
router.post("/", scrapeUrl);

// GET /api/scrape/:id - Get scrape status/result
router.get("/:id", getScrapeStatus);

export default router;
