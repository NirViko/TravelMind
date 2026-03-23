import React, { useState, useRef, FC } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Keyboard,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles";
import { travelApi } from "../../../api/travel";

interface SearchFormProps {
  startDate: Date;
  endDate: Date;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  destination: string;
  budget: string;
  currency: string;
  error: string | null;
  isLoading: boolean;
  formatDate: (date: Date) => string;
  onStartDateChange: (event: any, selectedDate?: Date) => void;
  onEndDateChange: (event: any, selectedDate?: Date) => void;
  onToggleStartPicker: () => void;
  onToggleEndPicker: () => void;
  onDestinationChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  onGeneratePlan: () => void;
  onSelectFromHistory?: (item: {
    destination: string;
    startDate: Date;
    endDate: Date;
    budget: string;
  }) => void;
}

const VOYAGE_PREFERENCES = [
  { id: "culinary", label: "Culinary", icon: "silverware-fork-knife" },
  { id: "art", label: "Art & Design", icon: "palette" },
  { id: "shopping", label: "Shopping", icon: "shopping" },
  { id: "relaxation", label: "Relaxation", icon: "spa" },
  { id: "adventure", label: "Adventure", icon: "hiking" },
  { id: "culture", label: "Culture", icon: "bank" },
];

const BUDGET_MAX = 5000;

const formatBudgetDisplay = (value: number): string => {
  if (value === 0) return "$0";
  return "$" + value.toLocaleString();
};

export const SearchForm: FC<SearchFormProps> = ({
  startDate,
  endDate,
  showStartDatePicker,
  showEndDatePicker,
  destination,
  budget,
  currency: _currency,
  error,
  isLoading,
  formatDate,
  onStartDateChange,
  onEndDateChange,
  onToggleStartPicker,
  onToggleEndPicker,
  onDestinationChange,
  onBudgetChange,
  onCurrencyChange: _onCurrencyChange,
  onGeneratePlan,
  onSelectFromHistory: _onSelectFromHistory,
}) => {
  const [destinationSuggestions, setDestinationSuggestions] = useState<string[]>([]);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [inputValue, setInputValue] = useState(destination);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState<number>(
    budget ? Math.min(parseFloat(budget) || 2500, BUDGET_MAX) : 2500
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectingRef = useRef(false);
  const dismissingKeyboardForListRef = useRef(false);

  React.useEffect(() => {
    setInputValue(destination);
  }, [destination]);

  React.useEffect(() => {
    const trimmed = inputValue.trim();
    if (trimmed.length < 2) {
      setDestinationSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      debounceRef.current = null;
      setAutocompleteLoading(true);
      travelApi
        .getDestinationsAutocomplete(trimmed)
        .then(({ destinations }) => {
          if (destinations.length) {
            setDestinationSuggestions(destinations);
            dismissingKeyboardForListRef.current = true;
            Keyboard.dismiss();
            setTimeout(() => {
              dismissingKeyboardForListRef.current = false;
            }, 600);
          }
        })
        .catch(() => setDestinationSuggestions([]))
        .finally(() => setAutocompleteLoading(false));
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [inputValue]);

  const showSuggestions =
    showDestinationDropdown &&
    inputValue.trim().length >= 2 &&
    (destinationSuggestions.length > 0 || autocompleteLoading);

  const handleSelectDestination = (value: string) => {
    selectingRef.current = true;
    Keyboard.dismiss();
    setInputValue(value);
    onDestinationChange(value);
    setDestinationSuggestions([]);
    setShowDestinationDropdown(false);
    setTimeout(() => {
      selectingRef.current = false;
    }, 100);
  };

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isStartDateSet = formatDate(startDate) !== formatDate(new Date(0));
  const isEndDateSet = formatDate(endDate) !== formatDate(new Date(0));

  return (
    <View style={styles.backgroundContainer}>
      <View style={styles.content}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Where to Next?</Text>
          <Text style={styles.subtitle}>
            Set your parameters for a nocturnal escape.
          </Text>
        </View>

        <View style={styles.formCard}>
          {/* Destination */}
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Destination</Text>
          </View>
          <View style={styles.destinationInputWrapper}>
            <Icon
              name="map-marker"
              size={20}
              color="#666666"
              style={styles.destinationIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="e.g. Metzingen, Germany"
              placeholderTextColor="#555555"
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                onDestinationChange(text);
                setShowDestinationDropdown(true);
              }}
              onFocus={() => setShowDestinationDropdown(true)}
              onBlur={() => {
                if (selectingRef.current || dismissingKeyboardForListRef.current)
                  return;
                setTimeout(() => setShowDestinationDropdown(false), 500);
              }}
              editable={!isLoading}
            />
          </View>
          {showSuggestions && (
            <View style={styles.destinationDropdown}>
              {autocompleteLoading ? (
                <View
                  style={[
                    styles.destinationOption,
                    { flexDirection: "row", alignItems: "center" },
                  ]}
                >
                  <ActivityIndicator size="small" color="#6B7FD4" />
                  <Text style={[styles.destinationOptionText, { marginLeft: 8 }]}>
                    Searching...
                  </Text>
                </View>
              ) : (
                <ScrollView
                  style={styles.destinationScrollView}
                  contentContainerStyle={styles.destinationScrollContent}
                  keyboardShouldPersistTaps="always"
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={true}
                  bounces={true}
                  onScrollBeginDrag={() => {
                    dismissingKeyboardForListRef.current = true;
                    Keyboard.dismiss();
                    setTimeout(() => {
                      dismissingKeyboardForListRef.current = false;
                    }, 600);
                  }}
                >
                  {destinationSuggestions.map((suggestion) => (
                    <TouchableOpacity
                      key={suggestion}
                      style={styles.destinationOption}
                      onPress={() => handleSelectDestination(suggestion)}
                    >
                      <Text style={styles.destinationOptionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}

          {/* Dates side by side */}
          <View style={styles.datesRow}>
            <View style={styles.dateFieldWrapper}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>Start Date</Text>
              </View>
              <TouchableOpacity
                onPress={onToggleStartPicker}
                disabled={isLoading}
                style={styles.dateInput}
              >
                <Text
                  style={[
                    styles.dateText,
                    isStartDateSet && styles.dateTextFilled,
                  ]}
                >
                  {formatDate(startDate)}
                </Text>
                <Icon name="calendar" size={18} color="#555555" />
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
            </View>

            <View style={styles.dateFieldWrapper}>
              <View style={styles.labelContainer}>
                <Text style={styles.label}>End Date</Text>
              </View>
              <TouchableOpacity
                onPress={onToggleEndPicker}
                disabled={isLoading}
                style={styles.dateInput}
              >
                <Text
                  style={[
                    styles.dateText,
                    isEndDateSet && styles.dateTextFilled,
                  ]}
                >
                  {formatDate(endDate)}
                </Text>
                <Icon name="calendar" size={18} color="#555555" />
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
            </View>
          </View>

          {/* Budget slider */}
          <View style={styles.budgetHeaderRow}>
            <View style={styles.budgetLabelContainer}>
              <Text style={styles.label}>Budget Preference</Text>
            </View>
            <Text style={styles.budgetValue}>
              {formatBudgetDisplay(sliderValue)}
            </Text>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={BUDGET_MAX}
              step={100}
              value={sliderValue}
              onValueChange={(val) => {
                setSliderValue(val);
                onBudgetChange(val > 0 ? String(val) : "");
              }}
              minimumTrackTintColor="#6B7FD4"
              maximumTrackTintColor="#2A2A2A"
              thumbTintColor="#6B7FD4"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>EXPLORER</Text>
              <Text style={styles.sliderLabel}>LUXURY</Text>
            </View>
          </View>

          {/* Voyage Preferences */}
          <View style={styles.voyageCard}>
            <Text style={styles.voyageTitle}>Voyage Preferences</Text>
            {Array.from({ length: Math.ceil(VOYAGE_PREFERENCES.length / 2) }).map((_, rowIndex) => {
              const left = VOYAGE_PREFERENCES[rowIndex * 2];
              const right = VOYAGE_PREFERENCES[rowIndex * 2 + 1];
              return (
                <View key={rowIndex} style={styles.chipsRow}>
                  {[left, right].map((pref) => {
                    if (!pref) return <View key="empty" style={styles.chipPlaceholder} />;
                    const isSelected = selectedPreferences.includes(pref.id);
                    return (
                      <TouchableOpacity
                        key={pref.id}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => togglePreference(pref.id)}
                        activeOpacity={0.7}
                      >
                        <Icon
                          name={pref.icon as any}
                          size={16}
                          color={isSelected ? "#FFFFFF" : "#888888"}
                        />
                        <Text
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}
                        >
                          {pref.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>

          {/* Submit button */}
          <TouchableOpacity
            style={styles.buttonWrapper}
            onPress={onGeneratePlan}
            disabled={!inputValue.trim() || isLoading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={["#6B7FD4", "#8B9FE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#1A1A2E" />
              ) : (
                <Icon name="star-four-points" size={20} color="#1A1A2E" />
              )}
              <Text style={styles.buttonText}>
                {isLoading ? "Creating Your Plan..." : "Plan Your Trip"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};