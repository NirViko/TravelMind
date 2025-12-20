import { useState, useRef } from "react";
import { TravelPlan, Destination } from "../../../types/travel";
import MapView from "react-native-maps";

interface UseTravelPlanDetailsProps {
  travelPlan: TravelPlan;
}

export const useTravelPlanDetails = ({ travelPlan }: UseTravelPlanDetailsProps) => {
  const [expandedDestination, setExpandedDestination] = useState<number | null>(null);
  const [selectedHotelIndex, setSelectedHotelIndex] = useState<number>(
    travelPlan.selectedHotelIndex ?? 0
  );
  const [activeTab, setActiveTab] = useState<string>("itinerary");
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const mapRef = useRef<MapView>(null);

  const toggleDestination = (visitOrder: number, destination: Destination) => {
    if (expandedDestination === visitOrder) {
      setExpandedDestination(null);
    } else {
      setExpandedDestination(visitOrder);
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: destination.coordinates.latitude,
            longitude: destination.coordinates.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          500
        );
      }
    }
  };

  const calculateMapRegion = () => {
    if (travelPlan.itinerary.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const latitudes = travelPlan.itinerary.map(
      (dest) => dest.coordinates.latitude
    );
    const longitudes = travelPlan.itinerary.map(
      (dest) => dest.coordinates.longitude
    );

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    const latDelta = (maxLat - minLat) * 1.5 || 0.1;
    const lngDelta = (maxLng - minLng) * 1.5 || 0.1;

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.01),
      longitudeDelta: Math.max(lngDelta, 0.01),
    };
  };

  const sortedItinerary = [...travelPlan.itinerary].sort(
    (a, b) => a.visitOrder - b.visitOrder
  );

  return {
    expandedDestination,
    selectedHotelIndex,
    activeTab,
    imageErrors,
    mapRef,
    sortedItinerary,
    setExpandedDestination,
    setSelectedHotelIndex,
    setActiveTab,
    setImageErrors,
    toggleDestination,
    calculateMapRegion,
  };
};

