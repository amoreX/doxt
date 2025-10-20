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

  // Remove comments
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");

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
