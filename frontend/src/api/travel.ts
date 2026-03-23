import { apiClient } from "./client";
import { TravelPlanRequest, TravelPlanResponse } from "../types/travel";

export const travelApi = {
  /**
   * Get destination suggestions (dynamic, via Google Places API)
   */
  async getDestinationsAutocomplete(
    input: string
  ): Promise<{ destinations: string[] }> {
    const trimmed = input.trim();
    if (!trimmed) return { destinations: [] };
    const params = new URLSearchParams({ input: trimmed });
    return apiClient.get<{ destinations: string[] }>(
      `/travel/destinations/autocomplete?${params.toString()}`
    );
  },

  /**
   * Generate a travel plan using AI
   */
  async generatePlan(
    request: TravelPlanRequest
  ): Promise<TravelPlanResponse> {
    return apiClient.post<TravelPlanResponse>("/travel/plan", request);
  },
};

