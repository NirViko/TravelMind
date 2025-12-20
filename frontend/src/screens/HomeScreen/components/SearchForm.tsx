import React from "react";
import { View, TextInput, ImageBackground, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
  const backgroundImage = {
    uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
  };

  return (
    <View style={styles.backgroundContainer}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Plan Your Perfect Trip</Text>
          <Text style={styles.subtitle}>
            Let AI create an unforgettable journey for you
          </Text>
        </View>

        <View style={styles.formCard}>
          {onSelectFromHistory ? (
            <SearchHistory onSelectSearch={onSelectFromHistory} />
          ) : null}

          <Text style={styles.label}>
            <Icon name="calendar-start" size={18} color="#4A90E2" /> Start Date
          </Text>
          <TouchableOpacity
            onPress={onToggleStartPicker}
            disabled={isLoading}
            style={styles.dateInput}
          >
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
            <Icon name="calendar" size={24} color="#4A90E2" />
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

          <Text style={styles.label}>
            <Icon name="calendar-end" size={18} color="#4A90E2" /> End Date
          </Text>
          <TouchableOpacity
            onPress={onToggleEndPicker}
            disabled={isLoading}
            style={styles.dateInput}
          >
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
            <Icon name="calendar" size={24} color="#4A90E2" />
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

          <Text style={styles.label}>
            <Icon name="map-marker" size={18} color="#4A90E2" /> Destination
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Where do you want to go? (e.g., Paris, France)"
            placeholderTextColor="#999999"
            value={destination}
            onChangeText={onDestinationChange}
            editable={!isLoading}
          />

          <Text style={styles.label}>
            <Icon name="wallet" size={18} color="#4A90E2" /> Budget
          </Text>
          <TextInput
            style={styles.input}
            placeholder={`Budget (${destination ? getCurrencyForDestination(destination) : "USD"})`}
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
            icon={() => <Icon name="magnify" size={20} color="#FFFFFF" />}
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
