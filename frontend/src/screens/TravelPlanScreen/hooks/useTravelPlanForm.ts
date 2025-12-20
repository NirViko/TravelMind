import { useState } from "react";
import { Platform } from "react-native";
import { useTravelPlan } from "../../../hooks/useTravelPlan";
import { TravelPlan } from "../../../types/travel";
import { useDateFormatter } from "../../../hooks/useDateFormatter";
import { useSearchHistoryStore } from "../../../store/searchHistoryStore";

export const useTravelPlanForm = () => {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date;
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [travelPlan, setTravelPlan] = useState<TravelPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  const travelPlanMutation = useTravelPlan();
  const { formatDateForAPI } = useDateFormatter();
  const { addSearch } = useSearchHistoryStore();

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "ios" && event.type === "set") {
      setShowStartDatePicker(false);
    } else if (Platform.OS === "android") {
      setShowStartDatePicker(false);
    }

    if (selectedDate && event.type !== "dismissed") {
      setStartDate(selectedDate);
      if (selectedDate >= endDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 1);
        setEndDate(newEndDate);
      }
      setError(null);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "ios" && event.type === "set") {
      setShowEndDatePicker(false);
    } else if (Platform.OS === "android") {
      setShowEndDatePicker(false);
    }

    if (selectedDate && event.type !== "dismissed") {
      if (selectedDate > startDate) {
        setEndDate(selectedDate);
        setError(null);
      } else {
        setError("End date must be after start date");
      }
    }
  };

  const handleGeneratePlan = async () => {
    if (!destination || !budget) {
      setError("Please fill in all fields");
      return;
    }

    if (endDate <= startDate) {
      setError("End date must be after start date");
      return;
    }

    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError("Budget must be a positive number");
      return;
    }

    setError(null);
    setTravelPlan(null);

    try {
      const result = await travelPlanMutation.mutateAsync({
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
        destination,
        budget: budgetNum,
      });

      if (result.success && result.data) {
        setTravelPlan(result.data);
        // Save to search history
        await addSearch({
          destination,
          startDate: formatDateForAPI(startDate),
          endDate: formatDateForAPI(endDate),
          budget,
        });
      } else {
        setError(result.error || "Failed to generate travel plan");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate travel plan");
    }
  };

  return {
    startDate,
    endDate,
    showStartDatePicker,
    showEndDatePicker,
    destination,
    budget,
    travelPlan,
    error,
    isLoading: travelPlanMutation.isPending,
    setShowStartDatePicker,
    setShowEndDatePicker,
    setDestination,
    setBudget,
    setTravelPlan,
    setStartDate,
    setEndDate,
    handleStartDateChange,
    handleEndDateChange,
    handleGeneratePlan,
  };
};

