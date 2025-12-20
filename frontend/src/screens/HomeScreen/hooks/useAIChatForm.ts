import { useState } from "react";
import { useAIChat } from "../../../hooks/useAI";

export const useAIChatForm = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState<string | null>(null);
  const aiChat = useAIChat();

  const handleAskAI = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setResponse("");

    try {
      const result = await aiChat.mutateAsync({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful travel assistant for TravelMind. Provide helpful and concise travel advice.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      if (result.success && result.data?.content) {
        setResponse(result.data.content);
      } else {
        setError("Failed to get response from AI");
      }
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error?.message || "Sorry, there was an error processing your request.";
      setError(errorMessage);
      setResponse("");
    }
  };

  return {
    prompt,
    response,
    error,
    isLoading: aiChat.isPending,
    setPrompt,
    handleAskAI,
  };
};

