import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TravelPlan, Destination } from "../../types/travel";
import { MapSection, DestinationDetailCard } from "./components";
import { NocturnalHeader } from "./components/NocturnalHeader";
import { DayScroller } from "./components/DayScroller";
import { TimelineView } from "./components/TimelineView";
import { BottomNav } from "./components/BottomNav";
import { EditPlanView } from "./components/EditPlanView";
import { NocturnalFAB } from "./components/NocturnalFAB";
import { useTravelPlanDetails } from "./hooks/useTravelPlanDetails";
import {
  useNocturnalItinerary,
  TimelineItem,
} from "./hooks/useNocturnalItinerary";

interface TravelPlanDetailsScreenProps {
  travelPlan: TravelPlan;
  onBack?: () => void;
}

export const TravelPlanDetailsScreen: React.FC<
  TravelPlanDetailsScreenProps
> = ({ travelPlan, onBack }) => {
  const {
    mapRef,
    sortedItinerary,
    calculateMapRegion,
    selectedHotelIndex,
    imageErrors,
    setSelectedHotelIndex,
    setImageErrors,
    toggleDestination,
    activeBottomTab,
    setActiveBottomTab,
    selectedDayIndex,
    setSelectedDayIndex,
  } = useTravelPlanDetails({ travelPlan });

  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [selectedDestinationForRoute, setSelectedDestinationForRoute] =
    useState<Destination | null>(null);

  const { dayDates, timelineItems, transitLabels } = useNocturnalItinerary({
    travelPlan,
    selectedDayIndex,
  });

  const currency = travelPlan.currency ?? "USD";

  const handleMarkerPress = (destination: any) => {
    setSelectedDestination(destination);
    setShowDetailCard(true);
    if (destination?.coordinates) {
      setSelectedDestinationForRoute(destination);
    }
  };

  const handleTimelineItemPress = (item: TimelineItem) => {
    if (item.type === "destination" && item.visitOrder != null) {
      const dest = sortedItinerary.find(
        (d) => d.visitOrder === item.visitOrder,
      );
      if (dest) {
        setSelectedDestination(dest);
        setShowDetailCard(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      {activeBottomTab !== "edit" && (
        <NocturnalHeader
          destinationName={travelPlan.destination}
          onBack={onBack}
        />
      )}

      {activeBottomTab !== "edit" && (
        <DayScroller
          days={dayDates}
          selectedIndex={selectedDayIndex}
          onSelect={setSelectedDayIndex}
        />
      )}

      {/* Main content area */}
      {activeBottomTab === "timeline" && (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TimelineView
            items={timelineItems}
            transitLabels={transitLabels}
            onItemPress={handleTimelineItemPress}
          />
        </ScrollView>
      )}

      {activeBottomTab === "explore" && (
        <View style={styles.mapContainer}>
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
      )}

      {activeBottomTab === "edit" && (
        <EditPlanView
          items={timelineItems}
          onSave={() => {}}
        />
      )}

      {activeBottomTab !== "edit" && <NocturnalFAB onPress={() => {}} />}

      <BottomNav activeTab={activeBottomTab} onTabChange={setActiveBottomTab} />

      <DestinationDetailCard
        destination={selectedDestination}
        currency={currency}
        visible={showDetailCard}
        onClose={() => {
          setShowDetailCard(false);
          setSelectedDestination(null);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0e0e0e",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  mapContainer: {
    flex: 1,
  },
});
