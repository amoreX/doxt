import { chromium } from "playwright";

export const scrapeWithPlaywright = async (url: string): Promise<string> => {
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
