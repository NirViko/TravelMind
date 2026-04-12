import React, { useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  Text,
  ScrollView,
  LayoutChangeEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import { SearchForm, EmptyTabScreen } from "./components";
import { useTravelPlanForm } from "../TravelPlanScreen/hooks/useTravelPlanForm";
import { useDateFormatter } from "../../hooks/useDateFormatter";
import { useAuthStore } from "../../store/authStore";
import { styles } from "./styles";
import { TravelPlan, Destination } from "../../types/travel";
import {
  DayScroller,
  MapSection,
  DestinationDetailCard,
} from "../TravelPlanDetailsScreen/components";
import { TimelineView } from "../TravelPlanDetailsScreen/components/TimelineView";
import { EditPlanView } from "../TravelPlanDetailsScreen/components/EditPlanView";
import {
  useNocturnalItinerary,
  TimelineItem,
} from "../TravelPlanDetailsScreen/hooks/useNocturnalItinerary";

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

// Inner component so hooks can be called safely with non-null travelPlan
function EditTabContent({
  travelPlan,
  selectedDayIndex,
  onSave,
}: {
  travelPlan: TravelPlan;
  selectedDayIndex: number;
  onSave: (reordered: TimelineItem[]) => void;
}) {
  const { timelineItems } = useNocturnalItinerary({
    travelPlan,
    selectedDayIndex,
  });

  return <EditPlanView items={timelineItems} onSave={onSave} />;
}

function TimelineTabContent({
  travelPlan,
  selectedDayIndex,
  onDaySelect,
  onItemPress,
  bottomPad,
}: {
  travelPlan: TravelPlan;
  selectedDayIndex: number;
  onDaySelect: (i: number) => void;
  onItemPress: (item: TimelineItem) => void;
  bottomPad: number;
}) {
  const { dayDates, timelineItems, transitLabels } = useNocturnalItinerary({
    travelPlan,
    selectedDayIndex,
  });

  return (
    <>
      <DayScroller
        days={dayDates}
        selectedIndex={selectedDayIndex}
        onSelect={onDaySelect}
      />
      <ScrollView
        style={{ paddingBottom: 112 }}
        contentContainerStyle={{ height: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <TimelineView
          items={timelineItems}
          transitLabels={transitLabels}
          onItemPress={onItemPress}
        />
      </ScrollView>
    </>
  );
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onLogout: _onLogout,
}) => {
  const { logout, isAuthenticated } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabId>("add");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [selectedDestinationForRoute, setSelectedDestinationForRoute] =
    useState<Destination | null>(null);

  const mapRef = useRef<MapView | null>(null);

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
  } = useTravelPlanForm(preferences);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Auto-switch to timeline when results arrive
  useEffect(() => {
    if (travelPlan) {
      setActiveTab("timeline");
      setSelectedDayIndex(0);
    }
  }, [travelPlan]);

  // Animate sliding circle to active tab
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

  const handleMarkerPress = (dest: any) => {
    setSelectedDestination(dest);
    setShowDetailCard(true);
    if (dest?.coordinates) setSelectedDestinationForRoute(dest);
  };

  const handleEditSave = (reordered: TimelineItem[]) => {
    if (!travelPlan) return;

    // Collect the original sorted times for this day
    const originalTimes = reordered
      .map((item) => item.sortTime)
      .slice()
      .sort((a, b) => a.localeCompare(b));

    // Build updated itinerary: reassign startTime based on new position order
    const updatedItinerary = travelPlan.itinerary.map((dest) => {
      const reorderedIndex = reordered.findIndex(
        (item) => item.id === `dest-${dest.visitOrder}`,
      );
      if (reorderedIndex === -1) return dest;
      return { ...dest, startTime: originalTimes[reorderedIndex] };
    });

    // Build updated restaurants: reassign startTime based on new position order
    const updatedRestaurants = (travelPlan.restaurants ?? []).map((rest, i) => {
      const dayNumber = selectedDayIndex + 1;
      const reorderedIndex = reordered.findIndex(
        (item) => item.id === `rest-${dayNumber}-${i}`,
      );
      if (reorderedIndex === -1) return rest;
      return { ...rest, startTime: originalTimes[reorderedIndex] };
    });

    setTravelPlan({
      ...travelPlan,
      itinerary: updatedItinerary,
      restaurants: updatedRestaurants,
    });
  };

  const handleTimelineItemPress = (item: TimelineItem) => {
    if (item.type === "destination" && item.visitOrder != null && travelPlan) {
      const dest = travelPlan.itinerary.find(
        (d) => d.visitOrder === item.visitOrder,
      );
      if (dest) {
        setSelectedDestination(dest);
        setShowDetailCard(true);
      }
    }
  };

  const calculateMapRegion = () => {
    if (!travelPlan || travelPlan.itinerary.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }
    const lats = travelPlan.itinerary.map((d) => d.coordinates.latitude);
    const lngs = travelPlan.itinerary.map((d) => d.coordinates.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5 || 0.1, 0.01),
      longitudeDelta: Math.max((maxLng - minLng) * 1.5 || 0.1, 0.01),
    };
  };

  const sortedItinerary = travelPlan
    ? [...travelPlan.itinerary].sort((a, b) => a.visitOrder - b.visitOrder)
    : [];

  const { formatDateForDisplay } = useDateFormatter();
  const currency2 = travelPlan?.currency ?? "USD";
  const navTitle = travelPlan ? travelPlan.destination : "New Voyage";

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
        <TouchableOpacity
          style={styles.topNavIconBtn}
          activeOpacity={0.7}
          onPress={
            travelPlan
              ? () => {
                  setTravelPlan(null);
                  setActiveTab("add");
                }
              : undefined
          }
        >
          <Icon
            name={travelPlan ? "arrow-left" : "arrow-left"}
            size={22}
            color={travelPlan ? "#FFFFFF" : "transparent"}
          />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>{navTitle}</Text>
        <TouchableOpacity
          style={styles.topNavIconBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Icon name="dots-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Tab content */}
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
            onPreferencesChange={setPreferences}
            onSelectFromHistory={handleSelectFromHistory}
          />
        </Animated.ScrollView>
      ) : activeTab === "timeline" ? (
        travelPlan ? (
          <TimelineTabContent
            travelPlan={travelPlan}
            selectedDayIndex={selectedDayIndex}
            onDaySelect={setSelectedDayIndex}
            onItemPress={handleTimelineItemPress}
            bottomPad={100 + insets.bottom}
          />
        ) : (
          <EmptyTabScreen
            icon="timeline-text-outline"
            title="No Timeline Yet"
            subtitle="Your trip timeline will show up here once you create a plan."
          />
        )
      ) : activeTab === "itinerary" ? (
        travelPlan ? (
          <View style={{ flex: 1 }}>
            <MapSection
              travelPlan={travelPlan}
              sortedItinerary={sortedItinerary}
              mapRef={mapRef}
              initialRegion={calculateMapRegion()}
              onMarkerPress={handleMarkerPress}
              isExpanded={true}
              selectedDestinationForRoute={selectedDestinationForRoute}
              onToggle={() => {}}
            />
          </View>
        ) : (
          <EmptyTabScreen
            icon="map-outline"
            title="No Itinerary Yet"
            subtitle="Plan your first trip and it will appear here."
          />
        )
      ) : activeTab === "edit" ? (
        travelPlan ? (
          <EditTabContent
            travelPlan={travelPlan}
            selectedDayIndex={selectedDayIndex}
            onSave={handleEditSave}
          />
        ) : (
          <EmptyTabScreen
            icon="calendar-edit"
            title="Nothing to Edit"
            subtitle="Once you have a trip plan, you can edit it here."
          />
        )
      ) : null}

      {/* Bottom navigation bar */}
      <View style={[styles.bottomNav, { paddingBottom: insets.bottom || 12 }]}>
        <Animated.View
          style={[
            styles.activeCircle,
            { transform: [{ translateX: circleX }] },
          ]}
          pointerEvents="none"
        >
          <View style={styles.activeCircleGradient} />
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
                color={isActive ? "#85adff" : "#555555"}
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

      {travelPlan && (
        <DestinationDetailCard
          destination={selectedDestination}
          currency={currency2}
          visible={showDetailCard}
          onClose={() => {
            setShowDetailCard(false);
            setSelectedDestination(null);
          }}
        />
      )}
    </View>
  );
};
