import { Request, Response } from "express";
import { scrapeWebpage, getScrapedData } from "../services/scrape.service";

export const scrapeUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }
    const { data_pup, data_play } = await scrapeWebpage(url);
    res.status(201).json({ puppeteer: data_pup, playwright: data_play });
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
