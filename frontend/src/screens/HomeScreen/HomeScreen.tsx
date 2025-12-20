import React from "react";
import { ScrollView, View } from "react-native";
import { TravelPlanDetailsScreen } from "../TravelPlanDetailsScreen";
import { SearchForm } from "./components";
import { useTravelPlanForm } from "../TravelPlanScreen/hooks/useTravelPlanForm";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { styles } from "./styles";

export const HomeScreen: React.FC = () => {
  const {
    startDate,
    endDate,
    showStartDatePicker,
    showEndDatePicker,
    destination,
    budget,
    travelPlan,
    error,
    isLoading,
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
  } = useTravelPlanForm();

  const handleSelectFromHistory = (item: {
    destination: string;
    startDate: Date;
    endDate: Date;
    budget: string;
  }) => {
    setDestination(item.destination);
    setBudget(item.budget);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
  };

  const { formatDateForDisplay } = useDateFormatter();

  if (travelPlan) {
    return (
      <TravelPlanDetailsScreen
        travelPlan={travelPlan}
        onBack={() => setTravelPlan(null)}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <SearchForm
        startDate={startDate}
        endDate={endDate}
        showStartDatePicker={showStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        destination={destination}
        budget={budget}
        error={error}
        isLoading={isLoading}
        formatDate={formatDateForDisplay}
        onStartDateChange={handleStartDateChange}
        onEndDateChange={handleEndDateChange}
        onToggleStartPicker={() => setShowStartDatePicker(!showStartDatePicker)}
        onToggleEndPicker={() => setShowEndDatePicker(!showEndDatePicker)}
        onDestinationChange={setDestination}
        onBudgetChange={setBudget}
        onGeneratePlan={handleGeneratePlan}
        onSelectFromHistory={handleSelectFromHistory}
      />
    </ScrollView>
  );
};
