import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Restaurant } from "../../../types/travel";
import { getRestaurantImage, getDefaultRestaurantImage } from "../../../utils/images";
import { openURL } from "../../../utils/linking";
import { styles } from "../styles";

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

  const isValidImage =
    restaurant.imageUrl &&
    restaurant.imageUrl !== "null" &&
    restaurant.imageUrl !== "N/A" &&
    restaurant.imageUrl.trim() !== "" &&
    restaurant.imageUrl.startsWith("http") &&
    !imageErrors.has(restaurant.imageUrl) &&
    !imageError;

  // Get restaurant image - use provided imageUrl, or search for one, or use default
  const imageUrl = isValidImage
    ? restaurant.imageUrl!
    : getRestaurantImage(restaurant.name, restaurant.cuisine);

  return (
    <Card style={styles.restaurantCard}>
      <View style={styles.restaurantImageContainer}>
        <Image
          source={{ uri: imageError ? getDefaultRestaurantImage() : imageUrl }}
          style={styles.restaurantImage}
          resizeMode="cover"
          onError={() => {
            setImageError(true);
            onImageError(imageUrl);
          }}
          onLoadStart={() => setImageError(false)}
        />
        {restaurant.rating && (
          <View style={styles.ratingBadge}>
            <Icon name="star" size={16} color="#FFA500" />
            <Text style={styles.ratingText}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>

      <Card.Content style={styles.restaurantCardContent}>
        <Text variant="titleLarge" style={styles.restaurantName}>
          {restaurant.name}
        </Text>
        <View style={styles.restaurantMeta}>
          {restaurant.cuisine && (
            <View style={styles.cuisineBadge}>
              <Icon name="silverware-fork-knife" size={14} color="#4A90E2" />
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
            <Text style={styles.websiteButtonText}>Visit Website</Text>
          </TouchableOpacity>
        )}
      </Card.Content>
    </Card>
  );
};
