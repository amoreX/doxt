import { scrapeWithPuppeteer } from "../utils/puppeteerScraper";
import { scrapeWithPlaywright } from "../utils/playwrightScraper";
import { cleanScrapedData } from "../utils/scrapeCleaner";
import { addToMemory } from "../utils/addingToMemory";

interface ScrapeResult {
  successful: string[];
  failed: Array<{ url: string; error: string }>;
}

/**
 * Scrape multiple URLs in parallel using scrape2save
 * Returns lists of successful and failed URLs
 */
export const scrapeWebpage = async (urls: string[]): Promise<ScrapeResult> => {
  const results: ScrapeResult = {
    successful: [],
    failed: [],
  };

  // Process all URLs in parallel
  const scrapePromises = urls.map(async (url) => {
    try {
      await scrape2save(url);
      results.successful.push(url);
      console.log(`✅ Successfully scraped and saved: ${url}`);
    } catch (error: any) {
      results.failed.push({
        url,
        error: error.message || "Unknown error",
      });
      console.error(`❌ Failed to scrape ${url}: ${error.message}`);
    }
  });

  // Wait for all scraping operations to complete
  await Promise.allSettled(scrapePromises);

  return results;
};

/**
 * Scrape, clean, and save a single URL to memory
 */
export const scrape2save = async (url: string) => {
  console.log(`📡 Scraping data from: ${url}`);
  const puppy = await scrapeWithPuppeteer(url);

  console.log(`🧹 Cleaning data from: ${url}`);
  const cleaned_data = cleanScrapedData(puppy, url);

  console.log(`💾 Adding to context: ${url}`);
  await addToMemory("conversation_id", cleaned_data);
};

export const getScrapedData = async (id: string) => {
  // TODO: Implement retrieval
  throw new Error("Not implemented");
};
