import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useUserLocation } from "../../../hooks/useUserLocation";
import { useRoute } from "../../../hooks/useRoute";
import { transportStyles } from "./styles/TransportTab.styles";
import { STRINGS } from "../../../constants/strings";

interface TransportTabProps {
  destination: string;
  destinationCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const TransportTab: React.FC<TransportTabProps> = ({
  destination,
  destinationCoordinates,
}) => {
  const [selectedTransport, setSelectedTransport] = useState<string | null>(
    null
  );
  const { location: userLocation } = useUserLocation();

  // Calculate route automatically
  const {
    route,
    distance,
    duration,
    loading: routeLoading,
    error: routeError,
    isFallback,
  } = useRoute(
    userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : null,
    destinationCoordinates || null
  );

  // Calculate distance in kilometers
  const distanceKm = distance ? distance / 1000 : null;
  
  // Determine transport options based on distance
  // Long distance (>1000km): Only flight
  // Short distance (<500km): Only public transport (no flight)
  // Medium distance (500-1000km): Show all options
  const isLongDistance = distanceKm ? distanceKm > 1000 : false;
  const isShortDistance = distanceKm ? distanceKm < 500 : false;
  const needsFlight = distanceKm ? distanceKm > 500 : false;

  const getFastestTransportMethod = (): { method: string; icon: string } => {
    if (!distance || !duration)
      return { method: STRINGS.calculating, icon: "clock-outline" };

    const distanceKm = distance / 1000;
    const durationHours = duration / 3600;
    const avgSpeed = distanceKm / durationHours; // km/h (driving speed)

    // If very short distance - walking/cycling
    if (distanceKm < 2) {
      return { method: "Walking/Cycling", icon: "walk" };
    }

    // If short distance but slow speed (city traffic) - transit might be faster
    // But we can't know for sure without calculating transit route
    // So we'll be conservative and say driving unless it's clearly a long route
    if (distanceKm < 20 && avgSpeed < 40) {
      // In city with traffic, transit might be similar or slightly better
      // But since we calculated driving, we'll show driving as it's what we have
      return { method: "Driving", icon: "car" };
    }

    // If medium distance - train might be faster, but we don't have transit calculation
    // So we'll show driving since that's what we calculated
    if (distanceKm < 300) {
      return { method: "Driving", icon: "car" };
    }

    // If long distance - flight is definitely faster
    if (distanceKm >= 500 || durationHours >= 8) {
      return { method: "Flight", icon: "airplane" };
    }

    // Default - driving (for highway routes)
    return { method: "Driving", icon: "car" };
  };

  const fastestMethod = getFastestTransportMethod();

  const formatDistance = (meters: number | null): string => {
    if (!meters) return STRINGS.calculating;
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return STRINGS.calculating;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTransitDirections = (mode: "transit" | "bus" | "train") => {
    if (!userLocation || !destinationCoordinates) return;

    const { latitude: originLat, longitude: originLng } = userLocation;
    const { latitude: destLat, longitude: destLng } = destinationCoordinates;

    // Google Maps URL with transit mode
    const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=${mode}`;
    Linking.openURL(url);
  };

  // Build transport options based on distance
  const transportOptions = [];
  
  // For long distances (>1000km): Only show flight (no car, no public transport)
  if (isLongDistance) {
    transportOptions.push({
      id: "flight",
      title: STRINGS.flight,
      icon: "airplane",
      description: STRINGS.flightDescription,
      color: "#4A90E2",
      action: () => {
        const searchQuery = encodeURIComponent(
          `flights to ${destination}`
        );
        Linking.openURL(
          `https://www.google.com/travel/flights?q=${searchQuery}`
        );
      },
    });
  } 
  // For short distances (<500km): Only show public transport and driving (no flight)
  else if (isShortDistance) {
    transportOptions.push(
      {
        id: "transit",
        title: STRINGS.publicTransit,
        icon: "train",
        description: STRINGS.publicTransitDescription,
        color: "#FF6B6B",
        action: () => getTransitDirections("transit"),
      },
      {
        id: "bus",
        title: STRINGS.bus,
        icon: "bus",
        description: STRINGS.busDescription,
        color: "#4ECDC4",
        action: () => getTransitDirections("transit"),
      },
      {
        id: "train",
        title: STRINGS.train,
        icon: "train",
        description: STRINGS.trainDescription,
        color: "#9B59B6",
        action: () => getTransitDirections("transit"),
      },
      {
        id: "directions",
        title: STRINGS.drivingDirections,
        icon: "car",
        description: STRINGS.drivingDirectionsDescription,
        color: "#FFA500",
        action: () => {
          if (userLocation && destinationCoordinates) {
            const { latitude: originLat, longitude: originLng } = userLocation;
            const { latitude: destLat, longitude: destLng } =
              destinationCoordinates;
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`
            );
          } else if (destinationCoordinates) {
            const { latitude, longitude } = destinationCoordinates;
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
            );
          } else {
            const searchQuery = encodeURIComponent(
              `directions to ${destination}`
            );
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
            );
          }
        },
      }
    );
  }
  // For medium distances (500-1000km): Show all options including driving
  else {
    transportOptions.push(
      {
        id: "transit",
        title: STRINGS.publicTransit,
        icon: "train",
        description: STRINGS.publicTransitDescription,
        color: "#FF6B6B",
        action: () => getTransitDirections("transit"),
      },
      {
        id: "bus",
        title: STRINGS.bus,
        icon: "bus",
        description: STRINGS.busDescription,
        color: "#4ECDC4",
        action: () => getTransitDirections("transit"),
      },
      {
        id: "train",
        title: STRINGS.train,
        icon: "train",
        description: STRINGS.trainDescription,
        color: "#9B59B6",
        action: () => getTransitDirections("transit"),
      },
      {
        id: "flight",
        title: STRINGS.flight,
        icon: "airplane",
        description: STRINGS.flightDescription,
        color: "#4A90E2",
        action: () => {
          const searchQuery = encodeURIComponent(
            `flights to ${destination}`
          );
          Linking.openURL(
            `https://www.google.com/travel/flights?q=${searchQuery}`
          );
        },
      },
      {
        id: "directions",
        title: STRINGS.drivingDirections,
        icon: "car",
        description: STRINGS.drivingDirectionsDescription,
        color: "#FFA500",
        action: () => {
          if (userLocation && destinationCoordinates) {
            const { latitude: originLat, longitude: originLng } = userLocation;
            const { latitude: destLat, longitude: destLng } =
              destinationCoordinates;
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`
            );
          } else if (destinationCoordinates) {
            const { latitude, longitude } = destinationCoordinates;
            Linking.openURL(
              `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`
            );
          } else {
            const searchQuery = encodeURIComponent(
              `directions to ${destination}`
            );
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${searchQuery}`
            );
          }
        },
      }
    );
  }

  return (
    <ScrollView
      style={transportStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {userLocation && destinationCoordinates && (
        <View style={transportStyles.routeCard}>
          <View style={transportStyles.routeHeader}>
            <Icon name="map-marker-path" size={24} color="#4A90E2" />
            <Text style={transportStyles.routeTitle}>{STRINGS.directRoute}</Text>
          </View>
          {routeLoading ? (
            <View style={transportStyles.loadingContainer}>
              <Text style={transportStyles.routeInfo}>
                {STRINGS.calculatingRoute}
              </Text>
            </View>
          ) : route.length > 0 && !isFallback ? (
            <View>
              <View style={transportStyles.routeDetails}>
                <View style={transportStyles.routeDetailItem}>
                  <Icon name="map-marker-distance" size={20} color="#4A90E2" />
                  <Text style={transportStyles.routeDetailText}>
                    {formatDistance(distance)}
                  </Text>
                </View>
                {/* Only show duration for short/medium distances - not for long distances (flights) */}
                {!isLongDistance && (
                  <View style={transportStyles.routeDetailItem}>
                    <Icon name="clock-outline" size={20} color="#4A90E2" />
                    <Text style={transportStyles.routeDetailText}>
                      {formatDuration(duration)}
                    </Text>
                  </View>
                )}
              </View>
              {/* Only show driving route info for short/medium distances */}
              {!isLongDistance && (
                <>
                  <View style={transportStyles.fastestMethodContainer}>
                    <Icon name="car" size={16} color="#4A90E2" />
                    <Text style={transportStyles.fastestMethodText}>
                      {STRINGS.drivingRouteCalculated}
                    </Text>
                  </View>
                  <View style={transportStyles.transitHint}>
                    <Icon name="information-outline" size={14} color="#666666" />
                    <Text style={transportStyles.transitHintText}>
                      {STRINGS.checkTransitOptions}
                    </Text>
                  </View>
                </>
              )}
              {/* For long distances, show flight recommendation */}
              {isLongDistance && (
                <View style={transportStyles.transitHint}>
                  <Icon name="airplane" size={14} color="#4A90E2" />
                  <Text style={transportStyles.transitHintText}>
                    For long distances, flight is the recommended option
                  </Text>
                </View>
              )}
            </View>
          ) : isFallback ? (
            <Text style={transportStyles.routeInfo}>
              {STRINGS.calculatingRoute} {STRINGS.useOptionsBelow}
            </Text>
          ) : null}
          <View style={transportStyles.transitHint}>
            <Icon name="information-outline" size={16} color="#666666" />
            <Text style={transportStyles.transitHintText}>
              {STRINGS.tapOptionsBelow}
            </Text>
          </View>
        </View>
      )}

      {transportOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            transportStyles.optionCard,
            selectedTransport === option.id && transportStyles.selectedCard,
          ]}
          onPress={() => {
            setSelectedTransport(option.id);
            option.action();
          }}
          activeOpacity={0.7}
        >
          <View
            style={[
              transportStyles.iconContainer,
              { backgroundColor: `${option.color}20` },
            ]}
          >
            <Icon name={option.icon as any} size={32} color={option.color} />
          </View>
          <View style={transportStyles.content}>
            <Text style={transportStyles.optionTitle}>{option.title}</Text>
            <Text style={transportStyles.optionDescription}>
              {option.description}
            </Text>
          </View>
          <Icon name="chevron-right" size={24} color="#CCCCCC" />
        </TouchableOpacity>
      ))}

      <View style={transportStyles.infoSection}>
        <View style={transportStyles.infoHeader}>
          <Icon name="information" size={20} color="#4A90E2" />
          <Text style={transportStyles.infoTitle}>{STRINGS.travelTips}</Text>
        </View>
        <Text style={transportStyles.infoText}>
          {STRINGS.travelTip1}{"\n"}{STRINGS.travelTip2}{"\n"}{STRINGS.travelTip3}{"\n"}{STRINGS.travelTip4}
        </Text>
      </View>
    </ScrollView>
  );
};
