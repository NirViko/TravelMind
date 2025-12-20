import { apiClient } from "./client";
import { TravelPlanRequest, TravelPlanResponse } from "../types/travel";

export const travelApi = {
  /**
   * Generate a travel plan using AI
   */
  async generatePlan(
    request: TravelPlanRequest
  ): Promise<TravelPlanResponse> {
    return apiClient.post<TravelPlanResponse>("/travel/plan", request);
  },
};

