import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import { Text, Card } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Restaurant } from "../../../types/travel";
import {
  getRestaurantImage,
  getDefaultRestaurantImage,
} from "../../../utils/images";
import { openURL } from "../../../utils/linking";
import { styles } from "../styles";
import { STRINGS } from "../../../constants/strings";

interface RestaurantCardProps {
  restaurant: Restaurant;
  imageErrors: Set<string>;
  onImageError: (url: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  imageErrors,
  onImageError,
}) => {
  const [imageError, setImageError] = useState(false);

  // Animation refs
  const fadeAnimationRef = useRef(new Animated.Value(0));
  const slideAnimationRef = useRef(new Animated.Value(50));

  const fadeAnimation = fadeAnimationRef.current;
  const slideAnimation = slideAnimationRef.current;

  const isValidImage =
    restaurant.imageUrl &&
    restaurant.imageUrl !== "null" &&
    restaurant.imageUrl !== "N/A" &&
    restaurant.imageUrl.trim() !== "" &&
    (restaurant.imageUrl.startsWith("http") ||
      restaurant.imageUrl.startsWith("https")) &&
    !imageErrors.has(restaurant.imageUrl) &&
    !imageError;

  const imageUrl = isValidImage
    ? restaurant.imageUrl!
    : getRestaurantImage(restaurant.name, restaurant.cuisine);

  // Fade in and slide up animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }],
        },
      ]}
    >
      <Card style={styles.restaurantCard}>
        <View style={styles.restaurantCardWrapper}>
          <View style={styles.restaurantImageContainer}>
            <Image
              source={{
                uri: imageError ? getDefaultRestaurantImage() : imageUrl,
              }}
              style={styles.restaurantImage}
              resizeMode="cover"
              onError={() => {
                setImageError(true);
                onImageError(imageUrl);
              }}
              onLoadStart={() => setImageError(false)}
            />
            {/* Overlay with rating */}
            <View style={styles.restaurantImageOverlay}>
              {restaurant.rating && (
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={16} color="#4A90E2" />
                  <Text style={styles.ratingText}>
                    {restaurant.rating.toFixed(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <Card.Content style={styles.restaurantCardContent}>
            <Text variant="titleLarge" style={styles.restaurantName}>
              {restaurant.name}
            </Text>
            <View style={styles.restaurantMeta}>
              {restaurant.cuisine && (
                <View style={styles.cuisineBadge}>
                  <Icon
                    name="silverware-fork-knife"
                    size={14}
                    color="#4A90E2"
                  />
                  <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
                </View>
              )}
              {restaurant.priceRange && (
                <View style={styles.priceRangeContainer}>
                  <Icon name="currency-usd" size={14} color="#666666" />
                  <Text style={styles.priceRange}>{restaurant.priceRange}</Text>
                </View>
              )}
            </View>
            <Text style={styles.restaurantDescription}>
              {restaurant.description}
            </Text>
            {restaurant.website && (
              <TouchableOpacity
                style={styles.websiteButton}
                onPress={() => openURL(restaurant.website)}
              >
                <Icon name="web" size={18} color="#4A90E2" />
                <Text style={styles.websiteButtonText}>
                  {STRINGS.visitWebsite}
                </Text>
              </TouchableOpacity>
            )}
          </Card.Content>
        </View>
      </Card>
    </Animated.View>
  );
};
