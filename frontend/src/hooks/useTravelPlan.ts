import { useMutation } from "@tanstack/react-query";
import { travelApi } from "../api/travel";
import { TravelPlanRequest } from "../types/travel";

/**
 * Hook for generating travel plans using AI
 */
export const useTravelPlan = () => {
  return useMutation({
    mutationFn: (request: TravelPlanRequest) => travelApi.generatePlan(request),
    onError: (error: Error) => {
      console.error("Travel Plan Error:", error);
    },
  });
};
