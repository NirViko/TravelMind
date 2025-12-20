import { apiClient } from "./client";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  success: boolean;
  data: {
    content: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

export interface TextGenerationRequest {
  prompt: string;
  model?: string;
  max_new_tokens?: number;
  temperature?: number;
}

export interface TextGenerationResponse {
  success: boolean;
  data: {
    content: string;
  };
}

export const aiApi = {
  /**
   * Send chat messages to Hugging Face AI
   */
  async chatCompletion(request: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>("/ai/chat", request);
  },

  /**
   * Generate text from a prompt
   */
  async textGeneration(
    request: TextGenerationRequest
  ): Promise<TextGenerationResponse> {
    return apiClient.post<TextGenerationResponse>("/ai/generate", request);
  },
};

