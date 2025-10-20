import puppeteer from "puppeteer";

export const scrapeWithPuppeteer = async (url: string): Promise<string> => {
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
    return html;
  } catch (err: any) {
    throw new Error(err.message);
  } finally {
    await browser.close();
  }
};
