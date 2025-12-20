import { Router, Request, Response } from "express";
import { HuggingFaceService, ChatMessage } from "../services/huggingface";

const router = Router();

interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

interface TextGenerationRequest {
  prompt: string;
  model?: string;
  max_new_tokens?: number;
  temperature?: number;
}

// Chat completion endpoint
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { messages, model, max_tokens, temperature }: ChatRequest = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Messages array is required",
      });
    }

    const response = await HuggingFaceService.chatCompletion(messages, model, {
      max_tokens,
      temperature,
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Chat endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate chat response",
    });
  }
});

// Text generation endpoint
router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { prompt, model, max_new_tokens, temperature }: TextGenerationRequest =
      req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be a string",
      });
    }

    const response = await HuggingFaceService.textGeneration(prompt, model, {
      max_new_tokens,
      temperature,
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error: any) {
    console.error("Text generation endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate text",
    });
  }
});

export default router;

