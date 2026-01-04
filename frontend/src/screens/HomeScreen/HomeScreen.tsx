import React, { useRef } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { TravelPlanDetailsScreen } from "../TravelPlanDetailsScreen";
import { SearchForm } from "./components";
import { useTravelPlanForm } from "../TravelPlanScreen/hooks/useTravelPlanForm";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { styles } from "./styles";

interface HomeScreenProps {
  onBack?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onBack }) => {
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

  const scrollY = useRef(new Animated.Value(0)).current;

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
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A0A0A", "#1A1A1A", "#2A2A2A", "#1A1A1A", "#0A0A0A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.backgroundGradient}
      />
      <Animated.View
        style={[
          styles.headerContainer,
          {
            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0],
              extrapolate: "clamp",
            }),
          },
        ]}
      >
        {onBack && (
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Plan Your Perfect Trip</Text>
        {onBack && <View style={styles.backButtonPlaceholder} />}
      </Animated.View>
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
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
          onToggleStartPicker={() =>
            setShowStartDatePicker(!showStartDatePicker)
          }
          onToggleEndPicker={() => setShowEndDatePicker(!showEndDatePicker)}
          onDestinationChange={setDestination}
          onBudgetChange={setBudget}
          onGeneratePlan={handleGeneratePlan}
          onSelectFromHistory={handleSelectFromHistory}
        />
      </Animated.ScrollView>
    </View>
  );
};
