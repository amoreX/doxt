import { scrapeWithPuppeteer } from "../utils/puppeteerScraper";
import { scrapeWithPlaywright } from "../utils/playwrightScraper";
import { cleanScrapedData, extractLinks } from "../utils/scrapeCleaner";

export const scrapeWebpage = async (url: string) => {
  try {
    console.log(`[Scraping] Starting parallel scrape for: ${url}`);

    // Run both scrapers in parallel
    const [html_play, html_pup] = await Promise.all([
      scrapeWithPlaywright(url),
      scrapeWithPuppeteer(url),
    ]);

    console.log(`[Cleaning] Processing scraped data...`);

    // Clean both results
    const cleanedData_play = cleanScrapedData(html_play, url);
    const cleanedData_pup = cleanScrapedData(html_pup, url);

    return {
      data_pup: cleanedData_pup,
      data_play: cleanedData_play,
    };
  } catch (error: any) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
};

export const getScrapedData = async (id: string) => {
  // TODO: Implement retrieval
  throw new Error("Not implemented");
};
