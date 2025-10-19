import { Router } from "express";
import { askQuestion, getConversationHistory } from "../controllers/ask.controller";

const router = Router();

// POST /api/ask - Ask a question based on scraped content
router.post("/", askQuestion);

// GET /api/ask/history - Get conversation history
router.get("/history", getConversationHistory);

export default router;
