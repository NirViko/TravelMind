import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

// Load environment variables if not already loaded
dotenv.config();

const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;

if (!HF_TOKEN) {
  console.warn("⚠️  HUGGINGFACE_TOKEN not found in environment variables");
  console.warn("   Make sure .env file exists in the backend directory");
}

// Initialize HfInference
// Note: The library should automatically use the new router endpoint
// If you still get the old endpoint error, try updating the library:
// npm install @huggingface/inference@latest
const hf = new HfInference(HF_TOKEN);

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface HuggingFaceRequest {
  model?: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
}

export class HuggingFaceService {
  /**
   * Generate text completion using Hugging Face Inference API
   * Uses the new router endpoint: https://router.huggingface.co
   */
  static async chatCompletion(
    messages: ChatMessage[],
    model: string = "meta-llama/Meta-Llama-3-8B-Instruct",
    options?: { max_tokens?: number; temperature?: number }
  ) {
    try {
      if (!HF_TOKEN) {
        throw new Error("Hugging Face token is not configured");
      }

      // Format messages for the model
      const formattedMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Try using the library first (should work with latest version)
      try {
        const response = await hf.chatCompletion({
          model,
          messages: formattedMessages,
          max_tokens: options?.max_tokens || 500,
          temperature: options?.temperature || 0.7,
        });

        return {
          success: true,
          content: response.choices[0]?.message?.content || "",
          usage: response.usage,
        };
      } catch (libError: any) {
        // If library fails (HTTP error, provider issue, etc.), try direct API call
        try {
          return await this.chatCompletionDirect(
            messages,
            model,
            options
          );
        } catch (directError: any) {
          // If direct call also fails, throw the original error
          throw libError;
        }
      }
    } catch (error: any) {
      console.error("Hugging Face API Error:", error);
      
      // Provide helpful error messages for common issues
      if (error.message?.includes("sufficient permissions") || 
          error.message?.includes("authentication method") ||
          error.message?.includes("Inference Providers")) {
        throw new Error(
          "❌ Hugging Face token doesn't have Inference API permissions.\n\n" +
          "To fix this:\n" +
          "1. Go to: https://huggingface.co/settings/tokens\n" +
          "2. Create a NEW token (or edit existing one)\n" +
          "3. Make sure to select 'Read' permission (required for Inference API)\n" +
          "4. Copy the new token and update it in backend/.env file\n" +
          "5. Restart the backend server"
        );
      }
      
      throw new Error(
        error.message || "Failed to generate response from Hugging Face"
      );
    }
  }

  /**
   * Direct API call to new router endpoint for chat completion
   */
  private static async chatCompletionDirect(
    messages: ChatMessage[],
    model: string,
    options?: { max_tokens?: number; temperature?: number }
  ) {
    // Use the chat completions endpoint
    const API_URL = `https://router.huggingface.co/v1/chat/completions`;
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: options?.max_tokens || 500,
        temperature: options?.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Handle chat completion response format
    if (data.choices && data.choices[0]?.message?.content) {
      return {
        success: true,
        content: data.choices[0].message.content,
        usage: data.usage,
      };
    } else if (data.generated_text) {
      // Fallback for text generation format
      return {
        success: true,
        content: data.generated_text,
      };
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      return {
        success: true,
        content: data[0].generated_text,
      };
    } else {
      console.error("Unexpected response format:", JSON.stringify(data, null, 2));
      throw new Error("Unexpected response format from Hugging Face API");
    }
  }

  /**
   * Generate text using text generation endpoint
   * Uses the new router endpoint: https://router.huggingface.co
   */
  static async textGeneration(
    prompt: string,
    model: string = "mistralai/Mistral-7B-Instruct-v0.2",
    options?: { max_new_tokens?: number; temperature?: number }
  ) {
    try {
      if (!HF_TOKEN) {
        throw new Error("Hugging Face token is not configured");
      }

      // Try using the library first
      try {
        const response = await hf.textGeneration({
          model,
          inputs: prompt,
          parameters: {
            max_new_tokens: options?.max_new_tokens || 500,
            temperature: options?.temperature || 0.7,
            return_full_text: false,
          },
        });

        return {
          success: true,
          content: response.generated_text,
        };
      } catch (libError: any) {
        // If library still uses old endpoint, use direct API call
        if (libError.message?.includes("no longer supported") || 
            libError.message?.includes("router.huggingface.co")) {
          return await this.textGenerationDirect(prompt, model, options);
        }
        throw libError;
      }
    } catch (error: any) {
      console.error("Hugging Face API Error:", error);
      
      // Provide helpful error messages for common issues
      if (error.message?.includes("sufficient permissions") || 
          error.message?.includes("authentication method") ||
          error.message?.includes("Inference Providers")) {
        throw new Error(
          "❌ Hugging Face token doesn't have Inference API permissions.\n\n" +
          "To fix this:\n" +
          "1. Go to: https://huggingface.co/settings/tokens\n" +
          "2. Create a NEW token (or edit existing one)\n" +
          "3. Make sure to select 'Read' permission (required for Inference API)\n" +
          "4. Copy the new token and update it in backend/.env file\n" +
          "5. Restart the backend server"
        );
      }
      
      throw new Error(
        error.message || "Failed to generate text from Hugging Face"
      );
    }
  }

  /**
   * Direct API call to new router endpoint for text generation
   */
  private static async textGenerationDirect(
    prompt: string,
    model: string,
    options?: { max_new_tokens?: number; temperature?: number }
  ) {
    const API_URL = `https://router.huggingface.co/hf-inference/models/${model}`;
    
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: options?.max_new_tokens || 500,
          temperature: options?.temperature || 0.7,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (data.generated_text) {
      return {
        success: true,
        content: data.generated_text,
      };
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      return {
        success: true,
        content: data[0].generated_text,
      };
    } else {
      throw new Error("Unexpected response format from Hugging Face API");
    }
  }
}

