import React from "react";
import { View, TextInput } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import {
  DatePickerInput,
  BudgetInput,
  ErrorDisplay,
  LoadingIndicator,
} from "./index";
import { styles } from "../styles";

interface TravelPlanFormProps {
  startDate: Date;
  endDate: Date;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  destination: string;
  budget: string;
  error: string | null;
  isLoading: boolean;
  formatDate: (date: Date) => string;
  onStartDateChange: (event: any, selectedDate?: Date) => void;
  onEndDateChange: (event: any, selectedDate?: Date) => void;
  onToggleStartPicker: () => void;
  onToggleEndPicker: () => void;
  onDestinationChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onGeneratePlan: () => void;
}

export const TravelPlanForm: React.FC<TravelPlanFormProps> = ({
  startDate,
  endDate,
  showStartDatePicker,
  showEndDatePicker,
  destination,
  budget,
  error,
  isLoading,
  formatDate,
  onStartDateChange,
  onEndDateChange,
  onToggleStartPicker,
  onToggleEndPicker,
  onDestinationChange,
  onBudgetChange,
  onGeneratePlan,
}) => {
  return (
    <Card style={styles.formCard}>
      <Card.Content>
        <DatePickerInput
          label="Start Date"
          date={startDate}
          onDateChange={onStartDateChange}
          showPicker={showStartDatePicker}
          onTogglePicker={onToggleStartPicker}
          minimumDate={new Date()}
          disabled={isLoading}
          formatDate={formatDate}
        />

        <DatePickerInput
          label="End Date"
          date={endDate}
          onDateChange={onEndDateChange}
          showPicker={showEndDatePicker}
          onTogglePicker={onToggleEndPicker}
          minimumDate={new Date(startDate.getTime() + 86400000)}
          disabled={isLoading}
          formatDate={formatDate}
        />

        <Text variant="labelLarge" style={styles.label}>
          Destination
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Destination (e.g., Paris, France)"
          value={destination}
          onChangeText={onDestinationChange}
          editable={!isLoading}
        />

        <BudgetInput
          budget={budget}
          destination={destination}
          onBudgetChange={onBudgetChange}
          disabled={isLoading}
        />

        <Button
          mode="contained"
          onPress={onGeneratePlan}
          style={styles.button}
          disabled={!destination || !budget || isLoading}
          loading={isLoading}
        >
          {isLoading ? "Generating Plan..." : "Generate Travel Plan"}
        </Button>

        <LoadingIndicator isLoading={isLoading} />
        <ErrorDisplay error={error || ""} />
      </Card.Content>
    </Card>
  );
};

