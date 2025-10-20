export interface CleanedContent {
  text: string;
  links: string[];
  metadata: {
    title?: string;
    description?: string;
    wordCount: number;
    linkCount: number;
  };
}

/**
 * Clean HTML and extract text content and links
 */
export const cleanScrapedData = (
  html: string,
  baseUrl: string,
): CleanedContent => {
  // Extract title
  const title = extractTitle(html);

  // Extract meta description
  const description = extractMetaDescription(html);

  // Remove script and style tags
  let cleaned = removeScriptAndStyleTags(html);

  // Extract links before removing HTML tags
  const links = extractLinks(html, baseUrl);

  // Remove HTML tags
  cleaned = removeHtmlTags(cleaned);

  // Decode HTML entities
  cleaned = decodeHtmlEntities(cleaned);

  // Remove hidden/invisible characters and sequences
  cleaned = removeHiddenContent(cleaned);

  // Clean up whitespace
  cleaned = cleanWhitespace(cleaned);

  // Count words
  const wordCount = countWords(cleaned);

  return {
    text: cleaned,
    links: links,
    metadata: {
      title,
      description,
      wordCount,
      linkCount: links.length,
    },
  };
};

/**
 * Extract title from HTML
 */
const extractTitle = (html: string): string | undefined => {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : undefined;
};

/**
 * Extract meta description
 */
const extractMetaDescription = (html: string): string | undefined => {
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["'](.*?)["']/i,
  );
  return descMatch ? descMatch[1].trim() : undefined;
};

/**
 * Remove script and style tags with their content
 */
const removeScriptAndStyleTags = (html: string): string => {
  let cleaned = html;

  // Remove script tags
  cleaned = cleaned.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    "",
  );

  // Remove style tags
  cleaned = cleaned.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    "",
  );

  // Remove noscript tags
  cleaned = cleaned.replace(
    /<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi,
    "",
  );

  // Remove SVG elements (often contain non-visible content)
  cleaned = cleaned.replace(
    /<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi,
    "",
  );

  // Remove comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

  // Remove ARIA hidden elements
  cleaned = cleaned.replace(
    /<[^>]+aria-hidden=["']true["'][^>]*>[\s\S]*?<\/[^>]+>/gi,
    "",
  );

  // Remove elements with display:none or visibility:hidden
  cleaned = cleaned.replace(
    /<[^>]+style=["'][^"']*(?:display\s*:\s*none|visibility\s*:\s*hidden)[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi,
    "",
  );

  return cleaned;
};

/**
 * Extract all links from HTML
 */
export const extractLinks = (html: string, baseUrl: string): string[] => {
  const linkRegex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/gi;
  const links: string[] = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[2];

    // Skip empty, javascript:, mailto:, tel:, and anchor links
    if (
      !href ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    ) {
      continue;
    }

    try {
      // Convert relative URLs to absolute
      const absoluteUrl = new URL(href, baseUrl).href;
      links.push(absoluteUrl);
    } catch (e) {
      // Skip invalid URLs
      continue;
    }
  }

  // Remove duplicates
  return [...new Set(links)];
};

/**
 * Remove all HTML tags
 */
const removeHtmlTags = (html: string): string => {
  return html.replace(/<[^>]+>/g, " ");
};

/**
 * Decode common HTML entities
 */
const decodeHtmlEntities = (text: string): string => {
  const entities: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&apos;": "'",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
  };

  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.replace(new RegExp(entity, "g"), char);
  }

  // Decode numeric entities
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  decoded = decoded.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
};

/**
 * Remove hidden content and invisible characters
 * This removes things like zero-width spaces, control characters,
 * and suspicious numeric sequences that aren't visible
 */
const removeHiddenContent = (text: string): string => {
  let cleaned = text;

  // Remove zero-width characters
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // Remove other invisible Unicode characters
  cleaned = cleaned.replace(/[\u00AD\u034F\u061C\u115F-\u1160]/g, "");

  // Remove control characters (except newlines and tabs)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Remove suspicious single-digit sequences with spaces (like "1 2 3 4 5 6 7 8 9")
  // This pattern matches sequences of single digits separated by spaces
  cleaned = cleaned.replace(/\b(\d\s+){2,}\d\b/g, "");

  // Remove sequences like "0 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25"
  // Matches sequences of numbers (1-3 digits) separated by spaces
  cleaned = cleaned.replace(/\b(\d{1,3}\s+){3,}\d{1,3}\b/g, "");

  // Remove sequences like "• 1 • 2 • 3"
  cleaned = cleaned.replace(/[•·]\s*\d+\s*/g, "");

  // Remove tab list markers that appear as numbers
  cleaned = cleaned.replace(/^\d+\s*$/gm, "");

  // Remove aria-labels and other accessibility text artifacts
  // (These sometimes appear as isolated numbers or short sequences)
  cleaned = cleaned.replace(/\b(tab|slide|item|step)\s+\d+\s+(of\s+\d+)?\b/gi, "");

  return cleaned;
};

/**
 * Clean up whitespace
 */
const cleanWhitespace = (text: string): string => {
  return text
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, "\n") // Remove empty lines
    .trim();
};

/**
 * Count words in text
 */
const countWords = (text: string): number => {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
};

/**
 * Extract main content (remove headers, footers, navigation)
 * This is a simple heuristic-based approach
 */
export const extractMainContent = (html: string): string => {
  let content = html;

  // Remove common non-content elements
  const tagsToRemove = [
    "header",
    "footer",
    "nav",
    "aside",
    "sidebar",
    "menu",
    "advertisement",
  ];

  tagsToRemove.forEach((tag) => {
    const regex = new RegExp(
      `<${tag}\\b[^<]*(?:(?!<\\/${tag}>)<[^<]*)*<\\/${tag}>`,
      "gi",
    );
    content = content.replace(regex, "");
  });

  return content;
};

/**
 * Get text summary (first N characters)
 */
export const getSummary = (text: string, maxLength: number = 500): string => {
  if (text.length <= maxLength) {
    return text;
  }

  // Try to cut at sentence boundary
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastQuestion = truncated.lastIndexOf("?");
  const lastExclamation = truncated.lastIndexOf("!");

  const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

  if (lastSentenceEnd > maxLength * 0.7) {
    return truncated.substring(0, lastSentenceEnd + 1).trim();
  }

  // Cut at last space
  const lastSpace = truncated.lastIndexOf(" ");
  return truncated.substring(0, lastSpace).trim() + "...";
};
