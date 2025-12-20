import { useMutation, useQuery } from "@tanstack/react-query";
import { aiApi, ChatRequest, TextGenerationRequest } from "../api/ai";

/**
 * Hook for chat completion using Hugging Face AI
 */
export const useAIChat = () => {
  return useMutation({
    mutationFn: (request: ChatRequest) => aiApi.chatCompletion(request),
    onError: (error: Error) => {
      console.error("AI Chat Error:", error);
    },
  });
};

/**
 * Hook for text generation using Hugging Face AI
 */
export const useAITextGeneration = () => {
  return useMutation({
    mutationFn: (request: TextGenerationRequest) =>
      aiApi.textGeneration(request),
    onError: (error: Error) => {
      console.error("AI Text Generation Error:", error);
    },
  });
};

