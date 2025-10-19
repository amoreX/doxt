import { Request, Response } from "express";
import { processQuestion, getHistory } from "../services/ask.service";

export const askQuestion = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { question, scrapeId, conversationId } = req.body;
    if (!question) {
      res.status(400).json({ error: "Question is required" });
      return;
    }
    const result = await processQuestion({
      question,
      scrapeId,
      conversationId,
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to process question" });
  }
};

export const getConversationHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { conversationId } = req.query;
    if (!conversationId) {
      res.status(400).json({ error: "Conversation ID is required" });
      return;
    }
    const history = await getHistory(conversationId as string);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve conversation history" });
  }
};
