import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useUserLocation } from "../../../hooks/useUserLocation";
import { useRoute } from "../../../hooks/useRoute";

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
  } = useRoute(
    userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : null,
    destinationCoordinates || null
  );

  const formatDistance = (meters: number | null): string => {
    if (!meters) return "Calculating...";
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "Calculating...";
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

  const transportOptions = [
    {
      id: "transit",
      title: "Public Transit",
      icon: "train",
      description: "Bus, train, and subway routes",
      color: "#FF6B6B",
      action: () => getTransitDirections("transit"),
    },
    {
      id: "bus",
      title: "Bus",
      icon: "bus",
      description: "Bus routes and schedules",
      color: "#4ECDC4",
      action: () => getTransitDirections("transit"), // Google Maps uses transit for bus
    },
    {
      id: "train",
      title: "Train",
      icon: "train",
      description: "Train routes and schedules",
      color: "#9B59B6",
      action: () => getTransitDirections("transit"), // Google Maps uses transit for train
    },
    {
      id: "flight",
      title: "Flight",
      icon: "airplane",
      description: "Book flights to your destination",
      color: "#4A90E2",
      action: () => {
        const searchQuery = encodeURIComponent(`flights to ${destination}`);
        Linking.openURL(
          `https://www.google.com/travel/flights?q=${searchQuery}`
        );
      },
    },
    {
      id: "directions",
      title: "Driving Directions",
      icon: "car",
      description: "Get driving directions",
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
    },
  ];

  return (
    <ScrollView
      style={transportStyles.container}
      showsVerticalScrollIndicator={false}
    >
      {userLocation && destinationCoordinates && (
        <View style={transportStyles.routeCard}>
          <View style={transportStyles.routeHeader}>
            <Icon name="map-marker-path" size={24} color="#4A90E2" />
            <Text style={transportStyles.routeTitle}>Direct Route</Text>
          </View>
          {routeLoading ? (
            <View style={transportStyles.loadingContainer}>
              <Text style={transportStyles.routeInfo}>
                Calculating route...
              </Text>
            </View>
          ) : route.length > 0 ? (
            <View style={transportStyles.routeDetails}>
              <View style={transportStyles.routeDetailItem}>
                <Icon name="map-marker-distance" size={20} color="#4A90E2" />
                <Text style={transportStyles.routeDetailText}>
                  {formatDistance(distance)}
                </Text>
              </View>
              <View style={transportStyles.routeDetailItem}>
                <Icon name="clock-outline" size={20} color="#4A90E2" />
                <Text style={transportStyles.routeDetailText}>
                  {formatDuration(duration)}
                </Text>
              </View>
            </View>
          ) : null}
          <View style={transportStyles.transitHint}>
            <Icon name="information-outline" size={16} color="#666666" />
            <Text style={transportStyles.transitHintText}>
              Tap the options below to see public transit routes (bus, train) on
              Google Maps
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
            <Icon name={option.icon} size={32} color={option.color} />
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
          <Text style={transportStyles.infoTitle}>Travel Tips</Text>
        </View>
        <Text style={transportStyles.infoText}>
          • Book flights in advance for better prices{"\n"}• Check train
          schedules for the best routes{"\n"}• Bus tickets can be purchased at
          stations or online{"\n"}• Use directions for real-time navigation
        </Text>
      </View>
    </ScrollView>
  );
};

const transportStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.2,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666666",
  },
  infoSection: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    marginBottom: 32,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
  },
  routeCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  routeInfo: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
  },
  routeError: {
    fontSize: 14,
    color: "#FF6B6B",
  },
  routeDetails: {
    flexDirection: "row",
    gap: 24,
    marginTop: 8,
  },
  routeDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  routeDetailText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
  loadingContainer: {
    paddingVertical: 8,
  },
  errorContainer: {
    paddingVertical: 8,
  },
  routeErrorHint: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4,
    fontStyle: "italic",
  },
  transitHint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    gap: 8,
  },
  transitHintText: {
    fontSize: 12,
    color: "#666666",
    flex: 1,
    lineHeight: 18,
  },
});
