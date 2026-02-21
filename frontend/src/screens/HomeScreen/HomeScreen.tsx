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
import { useAuthStore } from "../../store/authStore";
import { styles } from "./styles";

interface HomeScreenProps {
  onLogout?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout }) => {
  const { logout, isAuthenticated } = useAuthStore();

  // Step 6: Route Protection - This screen should only be accessible to authenticated users
  // If somehow accessed without auth, App.tsx will handle the redirect
  // But we add this check as an extra safety measure
  React.useEffect(() => {
    if (!isAuthenticated) {
      // This should not happen as App.tsx protects the route
      // But if it does, we ensure logout is called
      logout();
    }
  }, [isAuthenticated, logout]);

  const handleLogout = async () => {
    try {
      // Step 5: Remove token and reset state
      await logout();
      // Step 5: Redirect handled by App.tsx based on isAuthenticated state
      // No need to call onLogout callback as App.tsx will detect the state change
    } catch (error) {
      console.error("Error logging out:", error);
      // Could show an alert here if needed
    }
  };
  const {
    startDate,
    endDate,
    showStartDatePicker,
    showEndDatePicker,
    destination,
    budget,
    currency,
    travelPlan,
    error,
    isLoading,
    setShowStartDatePicker,
    setShowEndDatePicker,
    setDestination,
    setBudget,
    setCurrency,
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
        <View style={styles.backButtonPlaceholder} />
        <Text style={styles.headerTitle}>Plan Your Perfect Trip</Text>
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.7}
          style={styles.logoutButton}
        >
          <Icon name="logout" size={24} color="#FFFFFF" />
        </TouchableOpacity>
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
          currency={currency}
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
          onCurrencyChange={setCurrency}
          onGeneratePlan={handleGeneratePlan}
          onSelectFromHistory={handleSelectFromHistory}
        />
      </Animated.ScrollView>
    </View>
  );
};
