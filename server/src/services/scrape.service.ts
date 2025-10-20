import puppeteer from "puppeteer";
import { chromium } from "playwright";
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
      document.querySelectorAll('[role="button"]').forEach((btn: any) => {
        btn.click();
      });

      // Expand all collapsed sections
      document.querySelectorAll("details").forEach((detail: any) => {
        detail.open = true;
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
