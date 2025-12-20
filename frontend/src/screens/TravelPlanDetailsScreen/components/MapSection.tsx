import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { TravelPlan, Destination } from "../../../types/travel";
import { styles, getMarkerColor } from "../styles";
import { MapPopup } from "./MapPopup";
import { useUserLocation } from "../../../hooks/useUserLocation";
import { useRoute } from "../../../hooks/useRoute";

interface MapSectionProps {
  travelPlan: TravelPlan;
  sortedItinerary: Destination[];
  mapRef: React.RefObject<MapView | null>;
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  onMarkerPress?: (destination: Destination) => void;
  isExpanded: boolean;
  onToggle: () => void;
  selectedDestinationForRoute?: Destination | null;
}

export const MapSection: React.FC<MapSectionProps> = ({
  travelPlan,
  sortedItinerary,
  mapRef,
  initialRegion,
  onMarkerPress,
  isExpanded,
  onToggle,
  selectedDestinationForRoute,
}) => {
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const { location: userLocation } = useUserLocation();
  
  // Calculate route from user location to selected destination (or first destination if none selected)
  const destinationForRoute = selectedDestinationForRoute || (sortedItinerary.length > 0 ? sortedItinerary[0] : null);
  const { route, distance, duration } = useRoute(
    userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : null,
    destinationForRoute
      ? {
          latitude: destinationForRoute.coordinates.latitude,
          longitude: destinationForRoute.coordinates.longitude,
        }
      : null
  );

  const mapHeight = isExpanded ? 800 : 250;

  return (
    <View style={[styles.mapContainer, { height: mapHeight }]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        mapType="standard"
        scrollEnabled={isExpanded}
        zoomEnabled={isExpanded}
        showsUserLocation={!!userLocation}
        showsMyLocationButton={!!userLocation}
      >
        {route.length > 0 && (
          <Polyline
            coordinates={route}
            strokeColor="#4A90E2"
            strokeWidth={4}
            lineDashPattern={[1]}
          />
        )}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="Your Location"
            pinColor="#4A90E2"
          >
            <Callout>
              <MapPopup title="Your Location" subtitle="You are here" />
            </Callout>
          </Marker>
        )}
        {sortedItinerary.map((destination, index) => (
          <Marker
            key={`dest-${index}`}
            coordinate={{
              latitude: destination.coordinates.latitude,
              longitude: destination.coordinates.longitude,
            }}
            pinColor={getMarkerColor(destination.visitOrder)}
            onPress={() => {
              setSelectedMarker(index);
              onMarkerPress?.(destination);
            }}
          >
            <Callout onPress={() => onMarkerPress?.(destination)}>
              <MapPopup
                title={destination.title}
                subtitle={destination.description}
                imageUrl={destination.imageUrl || undefined}
              />
            </Callout>
          </Marker>
        ))}
        {travelPlan.restaurants &&
          travelPlan.restaurants.map((restaurant, index) => (
            <Marker
              key={`rest-${index}`}
              coordinate={{
                latitude: restaurant.coordinates.latitude,
                longitude: restaurant.coordinates.longitude,
              }}
              pinColor="#FF6B6B"
              onPress={() => {
                // Create a destination-like object for route calculation
                const restaurantDestination = {
                  ...restaurant,
                  coordinates: restaurant.coordinates,
                  title: restaurant.name,
                  visitOrder: 999 + index, // High number to avoid conflicts
                };
                onMarkerPress?.(restaurantDestination as Destination);
              }}
            >
              <Callout onPress={() => {
                const restaurantDestination = {
                  ...restaurant,
                  coordinates: restaurant.coordinates,
                  title: restaurant.name,
                  visitOrder: 999 + index,
                };
                onMarkerPress?.(restaurantDestination as Destination);
              }}>
                <MapPopup
                  title={restaurant.name}
                  subtitle={restaurant.description}
                  imageUrl={restaurant.imageUrl || undefined}
                  rating={restaurant.rating}
                />
              </Callout>
            </Marker>
          ))}
        {travelPlan.hotels &&
          travelPlan.hotels.map((hotel, index) => (
            <Marker
              key={`hotel-${index}`}
              coordinate={{
                latitude: hotel.coordinates?.latitude || 0,
                longitude: hotel.coordinates?.longitude || 0,
              }}
              pinColor="#4ECDC4"
              onPress={() => {
                if (hotel.coordinates) {
                  // Create a destination-like object for route calculation
                  const hotelDestination = {
                    ...hotel,
                    coordinates: hotel.coordinates,
                    title: hotel.name,
                    visitOrder: 1999 + index, // High number to avoid conflicts
                  };
                  onMarkerPress?.(hotelDestination as Destination);
                }
              }}
            >
              <Callout onPress={() => {
                if (hotel.coordinates) {
                  const hotelDestination = {
                    ...hotel,
                    coordinates: hotel.coordinates,
                    title: hotel.name,
                    visitOrder: 1999 + index,
                  };
                  onMarkerPress?.(hotelDestination as Destination);
                }
              }}>
                <MapPopup
                  title={hotel.name}
                  subtitle={hotel.description}
                  rating={4.5}
                  price={
                    hotel.estimatedPrice
                      ? `$${hotel.estimatedPrice} / night`
                      : undefined
                  }
                  onCheck={() => {
                    // Handle hotel check
                  }}
                />
              </Callout>
            </Marker>
          ))}
      </MapView>
      
      {/* Route info banner */}
      {route.length > 0 && destinationForRoute && userLocation && (
        <View style={styles.routeInfoBanner}>
          <View style={styles.routeInfoContent}>
            <Icon name="map-marker-path" size={20} color="#4A90E2" />
            <Text style={styles.routeInfoText} numberOfLines={1}>
              Route to: {destinationForRoute.title || destinationForRoute.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // Clear selected destination to show route to first destination
                if (onMarkerPress) {
                  const firstDest = sortedItinerary.length > 0 ? sortedItinerary[0] : null;
                  if (firstDest) {
                    onMarkerPress(firstDest);
                  }
                }
              }}
              style={styles.clearRouteButton}
            >
              <Icon name="close" size={18} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {!isExpanded && (
        <>
          <TouchableOpacity
            style={styles.mapClickableOverlay}
            onPress={onToggle}
            activeOpacity={1}
          />
          <TouchableOpacity
            style={styles.mapCollapsedOverlay}
            onPress={onToggle}
            activeOpacity={0.8}
          >
            <Icon name="map" size={24} color="#4A90E2" />
            <Icon name="chevron-up" size={20} color="#4A90E2" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};
