import { Request, Response } from "express";
import { scrapeWebpage, getScrapedData } from "../services/scrape.service";

export const scrapeUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "URL is required" });
      return;
    }
    const { status } = await scrapeWebpage(url);
    if (status) {
      res.status(201).json({ message: `${url} has been added as Context` });
    } else {
      res.status(400).json({ message: "Failed to insert url as context" });
    }
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
