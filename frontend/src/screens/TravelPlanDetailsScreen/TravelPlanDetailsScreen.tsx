import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { TravelPlan, Destination } from "../../types/travel";
import {
  HeaderSection,
  MapSection,
  DestinationDetailCard,
  ItineraryTab,
  HotelsTab,
  RestaurantsTab,
  TransportTab,
  TabTitle,
} from "./components";
import { TabSelector } from "./components/TabSelector";
import { useTravelPlanDetails } from "./hooks/useTravelPlanDetails";
import { styles } from "./styles";

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
    expandedDestination,
    selectedHotelIndex,
    activeTab,
    imageErrors,
    setSelectedHotelIndex,
    setActiveTab,
    setImageErrors,
    toggleDestination,
  } = useTravelPlanDetails({ travelPlan });

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isTabsExpanded, setIsTabsExpanded] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState<any>(null);
  const [showDetailCard, setShowDetailCard] = useState(false);
  const [selectedDestinationForRoute, setSelectedDestinationForRoute] =
    useState<Destination | null>(null);

  const handleMarkerPress = (destination: any) => {
    setSelectedDestination(destination);
    setShowDetailCard(true);
    // Set destination for route calculation
    if (destination && destination.coordinates) {
      setSelectedDestinationForRoute(destination);
    }
  };

  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url));
  };

  const handleToggleDestination = (visitOrder: number) => {
    const destination = sortedItinerary.find(
      (d) => d.visitOrder === visitOrder
    );
    if (destination) {
      toggleDestination(visitOrder, destination);
    }
  };

  const currency = travelPlan.currency || "USD";

  return (
    <View style={styles.container}>
      <HeaderSection travelPlan={travelPlan} onBack={onBack} />

      <MapSection
        travelPlan={travelPlan}
        sortedItinerary={sortedItinerary}
        mapRef={mapRef}
        initialRegion={calculateMapRegion()}
        onMarkerPress={handleMarkerPress}
        isExpanded={isMapExpanded}
        selectedDestinationForRoute={selectedDestinationForRoute}
        onToggle={() => {
          const newMapExpanded = !isMapExpanded;
          setIsMapExpanded(newMapExpanded);
          if (newMapExpanded) {
            setIsTabsExpanded(false);
          }
        }}
      />

      {isMapExpanded && !isTabsExpanded ? (
        <View style={styles.tabsOnlyContainer}>
          <TabSelector
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsTabsExpanded(true);
              setIsMapExpanded(false);
            }}
            isExpanded={false}
            isMapExpanded={true}
            onToggle={() => {
              setIsTabsExpanded(true);
              setIsMapExpanded(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.listContainer}>
          <TabSelector
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setIsTabsExpanded(true);
              setIsMapExpanded(false);
            }}
            isExpanded={isTabsExpanded}
            isMapExpanded={isMapExpanded}
            onToggle={() => {
              const newTabsExpanded = !isTabsExpanded;
              setIsTabsExpanded(newTabsExpanded);
              if (!newTabsExpanded) {
                setIsMapExpanded(false);
              }
            }}
          />

          {isTabsExpanded && !isMapExpanded && (
            <>
              <TabTitle activeTab={activeTab} />
              {activeTab === "itinerary" && (
                <ItineraryTab
                  sortedItinerary={sortedItinerary}
                  expandedDestination={expandedDestination}
                  currency={currency}
                  imageErrors={imageErrors}
                  onToggleDestination={handleToggleDestination}
                  onImageError={handleImageError}
                  cityName={travelPlan.destination}
                />
              )}

              {activeTab === "hotels" && travelPlan.hotels && (
                <HotelsTab
                  hotels={travelPlan.hotels}
                  selectedHotelIndex={selectedHotelIndex}
                  currency={currency}
                  onSelectHotel={setSelectedHotelIndex}
                  cityName={travelPlan.destination}
                />
              )}

              {activeTab === "restaurants" && travelPlan.restaurants && (
                <RestaurantsTab
                  restaurants={travelPlan.restaurants}
                  imageErrors={imageErrors}
                  onImageError={handleImageError}
                />
              )}

              {activeTab === "transport" && (
                <TransportTab
                  destination={travelPlan.destination}
                  destinationCoordinates={
                    selectedDestinationForRoute
                      ? selectedDestinationForRoute.coordinates
                      : sortedItinerary.length > 0
                      ? sortedItinerary[0].coordinates
                      : undefined
                  }
                />
              )}
            </>
          )}
        </View>
      )}

      <DestinationDetailCard
        destination={selectedDestination}
        currency={currency}
        visible={showDetailCard}
        onClose={() => {
          setShowDetailCard(false);
          setSelectedDestination(null);
        }}
      />
    </View>
  );
};
