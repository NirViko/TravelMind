import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GeminiOptions {
  maxOutputTokens?: number;
  temperature?: number;
}

export class GeminiService {
  /**
   * Generate chat completion using Google Gemini API
   * @param messages Array of chat messages
   * @param model Model name (default: "gemini-pro" - stable and accurate)
   * @param options Generation options
   */
  static async chatCompletion(
    messages: ChatMessage[],
    model: string = "gemini-pro",
    options?: GeminiOptions
  ) {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error(
          "Gemini API key is not configured. Please set GEMINI_API_KEY in your .env file"
        );
      }

      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      
      // Try gemini-1.0-pro first (most commonly available)
      // If that fails, the error will be caught and we'll fallback to Hugging Face
      const modelToUse = model === "gemini-pro" ? "gemini-1.0-pro" : model;
      
      const geminiModel = genAI.getGenerativeModel({
        model: modelToUse,
        generationConfig: {
          maxOutputTokens: options?.maxOutputTokens || 4000,
          temperature: options?.temperature || 0.3,
        },
      });

      // Convert messages to Gemini format
      // Gemini doesn't support system messages directly, so we'll prepend it to the first user message
      let systemMessage = "";
      const conversationHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

      for (const msg of messages) {
        if (msg.role === "system") {
          systemMessage = msg.content;
        } else {
          conversationHistory.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          });
        }
      }

      // If there's a system message, prepend it to the first user message
      if (systemMessage && conversationHistory.length > 0 && conversationHistory[0].role === "user") {
        conversationHistory[0].parts[0].text = `${systemMessage}\n\n${conversationHistory[0].parts[0].text}`;
      }

      // Build the chat history (all messages except the last one)
      const history = conversationHistory.slice(0, -1);
      const lastMessage = conversationHistory[conversationHistory.length - 1];

      // Start chat with history
      const chat = geminiModel.startChat({
        history: history,
      });

      // Send the last message
      const result = await chat.sendMessage(lastMessage.parts[0].text);

      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        content: text,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.usageMetadata?.totalTokenCount || 0,
        },
      };
    } catch (error: any) {
      console.error("Gemini API Error:", error);

      // Provide helpful error messages
      if (error.message?.includes("API_KEY")) {
        throw new Error(
          "❌ Invalid Gemini API key.\n\n" +
            "To fix this:\n" +
            "1. Go to: https://makersuite.google.com/app/apikey\n" +
            "2. Create a new API key\n" +
            "3. Copy the key and add it to backend/.env file as GEMINI_API_KEY=your_key_here\n" +
            "4. Restart the backend server"
        );
      }

      if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
        throw new Error(
          "❌ Gemini API rate limit exceeded.\n\n" +
            "Free tier limits: 15 requests/minute, 1,500 requests/day\n" +
            "Please wait a moment and try again."
        );
      }

      throw new Error(
        error.message || "Failed to generate response from Gemini API"
      );
    }
  }
}

