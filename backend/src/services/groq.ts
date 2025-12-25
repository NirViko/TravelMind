import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GroqOptions {
  maxTokens?: number;
  temperature?: number;
}

export class GroqService {
  /**
   * Generate chat completion using Groq API
   * Groq is fast, accurate, and has a generous free tier
   * @param messages Array of chat messages
   * @param model Model name (default: "llama-3.1-70b-versatile" - very accurate)
   * @param options Generation options
   */
  static async chatCompletion(
    messages: ChatMessage[],
    model: string = "llama-3.1-70b-versatile",
    options?: GroqOptions
  ) {
    try {
      if (!GROQ_API_KEY) {
        throw new Error(
          "Groq API key is not configured. Please set GROQ_API_KEY in your .env file"
        );
      }

      const groq = new Groq({
        apiKey: GROQ_API_KEY,
      });

      // Convert messages to Groq format
      const groqMessages = messages.map((msg) => ({
        role: msg.role === "system" ? "system" : msg.role,
        content: msg.content,
      }));

      const completion = await groq.chat.completions.create({
        messages: groqMessages as any,
        model,
        max_tokens: options?.maxTokens || 4000,
        temperature: options?.temperature || 0.3,
      });

      const content = completion.choices[0]?.message?.content || "";

      return {
        success: true,
        content,
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error("Groq API Error:", error);

      // Provide helpful error messages
      if (error.message?.includes("API key") || error.message?.includes("401")) {
        throw new Error(
          "❌ Invalid Groq API key.\n\n" +
            "To fix this:\n" +
            "1. Go to: https://console.groq.com/keys\n" +
            "2. Create a new API key (free tier available)\n" +
            "3. Copy the key and add it to backend/.env file as GROQ_API_KEY=your_key_here\n" +
            "4. Restart the backend server"
        );
      }

      if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
        throw new Error(
          "❌ Groq API rate limit exceeded.\n\n" +
            "Free tier limits: 30 requests/minute\n" +
            "Please wait a moment and try again."
        );
      }

      throw new Error(
        error.message || "Failed to generate response from Groq API"
      );
    }
  }
}

