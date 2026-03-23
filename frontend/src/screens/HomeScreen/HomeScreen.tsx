import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Text,
  LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TravelPlanDetailsScreen } from "../TravelPlanDetailsScreen";
import { SearchForm, EmptyTabScreen } from "./components";
import { useTravelPlanForm } from "../TravelPlanScreen/hooks/useTravelPlanForm";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { useAuthStore } from "../../store/authStore";
import { styles } from "./styles";

interface HomeScreenProps {
  onLogout?: () => void;
}

type TabId = "itinerary" | "timeline" | "edit" | "add";

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: "itinerary", label: "Itinerary", icon: "map" },
  { id: "timeline", label: "Timeline", icon: "timeline-text" },
  { id: "edit", label: "Edit", icon: "calendar-edit" },
  { id: "add", label: "Add", icon: "plus" },
];

const CIRCLE_SIZE = 52;

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogout: _onLogout,
}) => {
  const { logout, isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabId>("add");

  // Positions of each tab's center x, measured via onLayout
  const tabCenters = useRef<Record<TabId, number>>({
    itinerary: 0,
    timeline: 0,
    edit: 0,
    add: 0,
  });
  const circleX = useRef(new Animated.Value(0)).current;
  const [measured, setMeasured] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) logout();
  }, [isAuthenticated, logout]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
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

  // Animate circle to active tab
  useEffect(() => {
    const x = tabCenters.current[activeTab];
    if (x === 0 && !measured) return;
    Animated.spring(circleX, {
      toValue: x - CIRCLE_SIZE / 2,
      useNativeDriver: true,
      speed: 16,
      bounciness: 8,
    }).start();
  }, [activeTab, measured]);

  const handleTabLayout = (tabId: TabId) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabCenters.current[tabId] = x + width / 2;
    // Once all tabs measured, init circle position
    const allMeasured = TABS.every((t) => tabCenters.current[t.id] !== 0);
    if (allMeasured && !measured) {
      circleX.setValue(tabCenters.current["add"] - CIRCLE_SIZE / 2);
      setMeasured(true);
    }
  };

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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={["#0A0A0A", "#1A1A1A", "#2A2A2A", "#1A1A1A", "#0A0A0A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.25, 0.5, 0.75, 1]}
        style={styles.backgroundGradient}
      />

      {/* Top navigation bar */}
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.topNavIconBtn} activeOpacity={0.7}>
          <Icon name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>New Voyage</Text>
        <TouchableOpacity
          style={styles.topNavIconBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Icon name="dots-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {activeTab === "add" ? (
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 100 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
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
      ) : activeTab === "itinerary" ? (
        <EmptyTabScreen
          icon="map-outline"
          title="No Itinerary Yet"
          subtitle="Plan your first trip and it will appear here."
        />
      ) : activeTab === "timeline" ? (
        <EmptyTabScreen
          icon="timeline-text-outline"
          title="No Timeline Yet"
          subtitle="Your trip timeline will show up here once you create a plan."
        />
      ) : (
        <EmptyTabScreen
          icon="calendar-edit"
          title="Nothing to Edit"
          subtitle="Once you have a trip plan, you can edit it here."
        />
      )}

      {/* Bottom navigation bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 12 }]}>
        {/* Sliding purple circle indicator */}
        <Animated.View
          style={[
            styles.activeCircle,
            { transform: [{ translateX: circleX }] },
          ]}
          pointerEvents="none"
        >
          <LinearGradient
            colors={["#5B6FD4", "#7B8FE8"]}
            style={styles.activeCircleGradient}
          />
        </Animated.View>

        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.bottomNavTab}
              onPress={() => setActiveTab(tab.id)}
              onLayout={handleTabLayout(tab.id)}
              activeOpacity={0.8}
            >
              <Icon
                name={tab.icon as any}
                size={22}
                color={isActive ? "#FFFFFF" : "#555555"}
              />
              <Text
                style={[
                  styles.bottomNavLabel,
                  isActive && styles.bottomNavLabelActive,
                ]}
              >
                {tab.label.toUpperCase()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
