import React from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { styles } from "../styles";
import { getCurrencyForDestination } from "../../../utils/currency";
import { SearchHistory } from "./SearchHistory";

interface SearchFormProps {
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
  onSelectFromHistory?: (item: {
    destination: string;
    startDate: Date;
    endDate: Date;
    budget: string;
  }) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({
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
  onSelectFromHistory,
}) => {
  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>Create your dream journey with AI</Text>
        </View>

        <View style={styles.formCard}>
          {onSelectFromHistory ? (
            <SearchHistory onSelectSearch={onSelectFromHistory} />
          ) : null}

          <View style={styles.labelContainer}>
            <Icon name="calendar-start" size={18} color="#4A90E2" />
            <Text style={styles.label}>Start Date</Text>
          </View>
          <TouchableOpacity
            onPress={onToggleStartPicker}
            disabled={isLoading}
            style={styles.dateInput}
          >
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            <Icon name="calendar" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          {showStartDatePicker && (
            <>
              <DateTimePicker
                value={startDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onStartDateChange}
                minimumDate={new Date()}
              />
              {Platform.OS === "ios" && (
                <View style={styles.iosPickerButtons}>
                  <Button onPress={onToggleStartPicker}>Cancel</Button>
                  <Button mode="contained" onPress={onToggleStartPicker}>
                    Done
                  </Button>
                </View>
              )}
            </>
          )}

          <View style={styles.labelContainer}>
            <Icon name="calendar-end" size={18} color="#4A90E2" />
            <Text style={styles.label}>End Date</Text>
          </View>
          <TouchableOpacity
            onPress={onToggleEndPicker}
            disabled={isLoading}
            style={styles.dateInput}
          >
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            <Icon name="calendar" size={22} color="#CCCCCC" />
          </TouchableOpacity>
          {showEndDatePicker && (
            <>
              <DateTimePicker
                value={endDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onEndDateChange}
                minimumDate={new Date(startDate.getTime() + 86400000)}
              />
              {Platform.OS === "ios" && (
                <View style={styles.iosPickerButtons}>
                  <Button onPress={onToggleEndPicker}>Cancel</Button>
                  <Button mode="contained" onPress={onToggleEndPicker}>
                    Done
                  </Button>
                </View>
              )}
            </>
          )}

          <View style={styles.labelContainer}>
            <Icon name="map-marker" size={18} color="#4A90E2" />
            <Text style={styles.label}>Destination</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Where do you want to go? (e.g., Paris, France)"
            placeholderTextColor="#999999"
            value={destination}
            onChangeText={onDestinationChange}
            editable={!isLoading}
          />

          <View style={styles.labelContainer}>
            <Icon name="wallet" size={18} color="#4A90E2" />
            <Text style={styles.label}>Budget</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder={`Budget (${
              destination ? getCurrencyForDestination(destination) : "USD"
            })`}
            placeholderTextColor="#999999"
            value={budget}
            onChangeText={onBudgetChange}
            keyboardType="numeric"
            editable={!isLoading}
          />
          {destination && (
            <Text style={styles.currencyHint}>
              Currency: {getCurrencyForDestination(destination)}
            </Text>
          )}

          <Button
            mode="contained"
            onPress={onGeneratePlan}
            style={styles.button}
            disabled={!destination || !budget || isLoading}
            loading={isLoading}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={styles.buttonText}
            icon={() => <Icon name="magnify" size={22} color="#FFFFFF" />}
          >
            {isLoading ? "Creating Your Plan..." : "Generate Travel Plan"}
          </Button>

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4A90E2" />
              <Text style={styles.loadingText}>
                AI is creating your perfect travel plan...
              </Text>
            </View>
          )}

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Error:</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
