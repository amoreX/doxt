import { Request, Response } from "express";
import {
  scrapeWebpage_play,
  scrapeWebpage_pup,
  getScrapedData,
} from "../services/scrape.service";
import puppeteer from "puppeteer";

export const scrapeUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }
    const result = await scrapeWebpage_pup(url);
    const result2 = await scrapeWebpage_play(url);
    res.status(201).json({ puppeteer: result, playwright: result2 });
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
