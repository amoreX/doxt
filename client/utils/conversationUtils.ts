import { Conversation } from "@/types/dashboard";

/**
 * Generate the next available conversation ID
 */
export function generateConversationId(conversations: Conversation[]): number {
  return conversations.length > 0
    ? Math.max(...conversations.map((c) => c.id)) + 1
    : 1;
}

/**
 * Create a new conversation with auto-generated ID and current date
 */
export function createConversation(
  conversations: Conversation[],
  title: string,
): Conversation {
  return {
    id: generateConversationId(conversations),
    title: title,
    date: new Date().toLocaleDateString(),
  };
}

/**
 * Generate a conversation title from text (max 50 chars)
 */
export function createTitleFromMessage(message: string): string {
  const maxLength = 50;
  return message.length > maxLength
    ? message.slice(0, maxLength) + "..."
    : message;
}

/**
 * Generate a conversation title from URL (max 40 chars)
 */
export function createTitleFromUrl(url: string): string {
  const maxLength = 40;
  const urlText = url.slice(0, maxLength);
  return `Scraped: ${urlText}...`;
}

/**
 * Format scraped data for display in chat
 */
export function formatScrapedData(url: string, data: any): string {
  return `✅ Successfully scraped URL: ${url}`;
}

/**
 * Format scrape response with successful and failed URLs
 */
export function formatScrapeResponse(response: {
  successful: string[];
  failed: Array<{ url: string; error: string }>;
  successCount: number;
  failCount: number;
}): string {
  const { successful, failed, successCount, failCount } = response;

  let message = "";

  // Successful URLs
  if (successCount > 0) {
    message += `**✅ Successfully Added (${successCount}):**\n`;
    successful.forEach((url, index) => {
      message += `${index + 1}. ${url}\n`;
    });
    message += "\n";
  }

  // Failed URLs
  if (failCount > 0) {
    message += `**❌ Failed (${failCount}):**\n`;
    failed.forEach((item, index) => {
      message += `${index + 1}. ${item.url}\n   *Error: ${item.error}*\n`;
    });
  }

  return message.trim();
}
