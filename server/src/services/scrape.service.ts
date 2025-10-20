import puppeteer from "puppeteer";
import { chromium } from "playwright";
import { cleanScrapedData, extractLinks } from "../utils/scrapeCleaner";

export const scrapeWebpage = async (url: string) => {
  try {
    // Use Playwright to scrape (you can switch to Puppeteer if needed)
    const html_play = await scrapeWebpage_play(url);
    const html_pup = await scrapeWebpage_pup(url);
    // Clean and extract text and links
    const cleanedData_pup = cleanScrapedData(html_pup, url);
    const cleanedData_play = cleanScrapedData(html_play, url);

    return {
      data_pup: cleanedData_pup,
      data_play: cleanedData_play,
    };
  } catch (error: any) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
};

export const scrapeWebpage_pup = async (url: string) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    );

    await page.goto(url, { waitUntil: "networkidle2" });
    const html = await page.content();
    console.log("Data:", html);
    return html;
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
};

// import { chromium } from "playwright";
export const scrapeWebpage_play = async (url: string) => {
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    const page = await context.newPage();

    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Trigger all dropdowns/modals to load their content
    await page.evaluate(() => {
      // Click all dropdown triggers
      const buttons = document.querySelectorAll('[role="button"]');
      buttons.forEach((btn) => {
        (btn as HTMLElement).click();
      });

      // Expand all collapsed sections
      const details = document.querySelectorAll("details");
      details.forEach((detail) => {
        (detail as HTMLDetailsElement).open = true;
      });
    });

    // Wait for content to load after interactions
    await page.waitForTimeout(2000);

    const html = await page.content();
    return html;
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
};
export const getScrapedData = async (id: string) => {
  // TODO: Implement retrieval
  throw new Error("Not implemented");
};
