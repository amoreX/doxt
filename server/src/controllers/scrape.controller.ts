import { Request, Response } from "express";
import { scrapeWebpage, getScrapedData } from "../services/scrape.service";

export const scrapeUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;

    // Validate that url is provided and is an array
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }

    if (!Array.isArray(url)) {
      res.status(400).json({ error: "URL must be an array of strings" });
      return;
    }

    if (url.length === 0) {
      res.status(400).json({ error: "URL array cannot be empty" });
      return;
    }

    // Scrape all URLs
    const result = await scrapeWebpage(url);

    res.status(201).json({
      message: "Scraping completed",
      successful: result.successful,
      failed: result.failed,
      successCount: result.successful.length,
      failCount: result.failed.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getScrapeStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = await getScrapedData(id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve scrape data" });
  }
};
