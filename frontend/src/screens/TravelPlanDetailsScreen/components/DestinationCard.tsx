import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Destination } from "../../../types/travel";
import { formatCurrency } from "../../../utils/currency";
import { getDestinationImage } from "../../../utils/images";
import { openURL } from "../../../utils/linking";
import { styles } from "../styles";
import { STRINGS } from "../../../constants/strings";

interface DestinationCardProps {
  destination: Destination;
  isExpanded: boolean;
  currency: string;
  imageErrors: Set<string>;
  onToggle: () => void;
  onImageError: (url: string) => void;
  cityName?: string;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isExpanded,
  currency,
  imageErrors,
  onToggle,
  onImageError,
  cityName,
}) => {
  const [imageError, setImageError] = useState(false);
  const expandAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const isValidImage =
    destination.imageUrl &&
    destination.imageUrl !== "null" &&
    destination.imageUrl !== "N/A" &&
    destination.imageUrl.trim() !== "" &&
    (destination.imageUrl.startsWith("http") || destination.imageUrl.startsWith("https")) &&
    !imageErrors.has(destination.imageUrl) &&
    !imageError;

  const imageUrl = isValidImage
    ? destination.imageUrl!
    : getDestinationImage(destination.title, cityName);

  // Animate card expansion
  useEffect(() => {
    Animated.spring(expandAnimation, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [isExpanded, expandAnimation]);

  // Animate chevron rotation
  useEffect(() => {
    Animated.spring(rotateAnimation, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isExpanded, rotateAnimation]);

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  const chevronRotation = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const contentHeight = expandAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200], // Adjust based on content height
  });

  return (
    <Animated.View
      style={[
        { opacity: fadeAnimation, transform: [{ scale: fadeAnimation }] },
      ]}
    >
    <Card style={[styles.destinationCard, isExpanded && styles.expandedCard]}>
      <View style={styles.destinationCardWrapper}>
        <TouchableOpacity onPress={onToggle} activeOpacity={0.9}>
          <View style={styles.destinationImageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.destinationImage}
            resizeMode="cover"
            onError={() => {
              setImageError(true);
              onImageError(imageUrl);
            }}
            onLoadStart={() => setImageError(false)}
          />
          {/* Overlay with order badge and price */}
          <View style={styles.imageOverlay}>
            <View style={styles.orderBadgeOverlay}>
              <View style={styles.orderBadge}>
                <Text style={styles.orderText}>{destination.visitOrder}</Text>
              </View>
            </View>
            {destination.price !== undefined && destination.price !== null && (
              <View style={styles.priceOverlay}>
                <Text style={styles.priceOverlayText}>
                  {formatCurrency(destination.price, currency)}
                </Text>
              </View>
            )}
          </View>
        </View>

        <Card.Content style={styles.destinationCardContent}>
          <View style={styles.destinationHeader}>
            <View style={styles.destinationInfo}>
              <Text variant="titleLarge" style={styles.destinationTitle}>
                {destination.title}
              </Text>
              <View style={styles.destinationMeta}>
                {destination.estimatedDuration && (
                  <View style={styles.metaItem}>
                    <Icon name="clock-outline" size={16} color="#666666" />
                    <Text style={styles.metaText}>
                      {destination.estimatedDuration}
                    </Text>
                  </View>
                )}
                {destination.price !== undefined &&
                  destination.price !== null && (
                    <View style={styles.metaItem}>
                      <Icon name="wallet" size={16} color="#4A90E2" />
                      <Text style={styles.priceText}>
                        {formatCurrency(destination.price, currency)}
                      </Text>
                    </View>
                  )}
              </View>
            </View>
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <Icon name="chevron-down" size={24} color="#4A90E2" />
            </Animated.View>
          </View>

          <Animated.View
            style={{
              maxHeight: contentHeight,
              overflow: "hidden",
              opacity: expandAnimation,
            }}
          >
            <Divider style={styles.divider} />
            <Text style={styles.destinationDescription}>
              {destination.description}
            </Text>
            {destination.ticketLink && (
              <TouchableOpacity
                style={styles.ticketButton}
                onPress={() => openURL(destination.ticketLink)}
                activeOpacity={0.8}
              >
                <Icon name="ticket" size={20} color="#FFFFFF" />
                <Text style={styles.ticketButtonText}>{STRINGS.buyTickets}</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </Card.Content>
      </TouchableOpacity>
      </View>
    </Card>
    </Animated.View>
  );
};
