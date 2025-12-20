import React from "react";
import { View, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { TravelPlanDetailsScreen } from "../TravelPlanDetailsScreen";
import { TravelPlanForm } from "./components";
import { useTravelPlanForm } from "./hooks/useTravelPlanForm";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { styles } from "./styles";

export const TravelPlanScreen: React.FC = () => {
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
    handleStartDateChange,
    handleEndDateChange,
    handleGeneratePlan,
  } = useTravelPlanForm();

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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text variant="displaySmall" style={styles.title}>
          Create Your Travel Plan
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Let AI plan your perfect trip
        </Text>

        <TravelPlanForm
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
        />
      </View>
    </ScrollView>
  );
};

