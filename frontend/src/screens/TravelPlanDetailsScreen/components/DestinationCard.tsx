import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, Card, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Destination } from "../../../types/travel";
import { formatCurrency } from "../../../utils/currency";
import { getDestinationImage } from "../../../utils/images";
import { openURL } from "../../../utils/linking";
import { styles } from "../styles";

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

  const isValidImage =
    destination.imageUrl &&
    destination.imageUrl !== "null" &&
    destination.imageUrl !== "N/A" &&
    destination.imageUrl.trim() !== "" &&
    destination.imageUrl.startsWith("http") &&
    !imageErrors.has(destination.imageUrl) &&
    !imageError;

  // Get image URL - use provided imageUrl, or search for one, or use default
  const imageUrl = isValidImage
    ? destination.imageUrl!
    : getDestinationImage(destination.title, cityName);

  return (
    <Card style={[styles.destinationCard, isExpanded && styles.expandedCard]}>
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
          <View style={styles.orderBadgeOverlay}>
            <View style={styles.orderBadge}>
              <Text style={styles.orderText}>{destination.visitOrder}</Text>
            </View>
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
            <Icon
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={24}
              color="#4A90E2"
            />
          </View>

          {isExpanded && (
            <>
              <Divider style={styles.divider} />
              <Text style={styles.destinationDescription}>
                {destination.description}
              </Text>
              {destination.ticketLink && (
                <TouchableOpacity
                  style={styles.ticketButton}
                  onPress={() => openURL(destination.ticketLink)}
                >
                  <Icon name="ticket" size={20} color="#FFFFFF" />
                  <Text style={styles.ticketButtonText}>Buy Tickets</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};
