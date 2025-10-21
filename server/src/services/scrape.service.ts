import { scrapeWithPuppeteer } from "../utils/puppeteerScraper";
import { scrapeWithPlaywright } from "../utils/playwrightScraper";
import { cleanScrapedData } from "../utils/scrapeCleaner";
import { addToMemory } from "../utils/addingToMemory";
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
    // const cleanedData_play = cleanScrapedData(html_play, url);
    const cleanedData_pup = cleanScrapedData(html_pup, url);

    // Add cleaned data to memory
    // Adding puppeteer data to memory
    await addToMemory("conversation_id", cleanedData_pup);
    return {
      status: true,
    };
  } catch (error: any) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
};

export const getScrapedData = async (id: string) => {
  // TODO: Implement retrieval
  throw new Error("Not implemented");
};
