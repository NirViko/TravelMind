import React, { useState } from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text, Card, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Hotel } from "../../../types/travel";
import { formatCurrency } from "../../../utils/currency";
import { getHotelImage, getDefaultHotelImage } from "../../../utils/images";
import { openURL } from "../../../utils/linking";
import { styles } from "../styles";

interface HotelCardProps {
  hotel: Hotel;
  index: number;
  isSelected: boolean;
  currency: string;
  onSelect: (index: number) => void;
  cityName?: string;
}

export const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  index,
  isSelected,
  currency,
  onSelect,
  cityName,
}) => {
  const [imageError, setImageError] = useState(false);

  // Get hotel image - search by hotel name and city
  const imageUrl = getHotelImage(hotel.name, cityName);

  return (
    <Card style={[styles.hotelCard, isSelected && styles.selectedHotelCard]}>
      <TouchableOpacity onPress={() => onSelect(index)} activeOpacity={0.9}>
        <View style={styles.hotelImageContainer}>
          <Image
            source={{ uri: imageError ? getDefaultHotelImage() : imageUrl }}
            style={styles.hotelImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
            onLoadStart={() => setImageError(false)}
          />
          <View style={styles.hotelRadioOverlay}>
            <RadioButton
              value={index.toString()}
              status={isSelected ? "checked" : "unchecked"}
              onPress={() => onSelect(index)}
              color="#4A90E2"
            />
          </View>
        </View>

        <Card.Content style={styles.hotelCardContent}>
          <Text variant="titleLarge" style={styles.hotelName}>
            {hotel.name}
          </Text>
          <Text style={styles.hotelDescription}>{hotel.description}</Text>
          {hotel.estimatedPrice && (
            <View style={styles.hotelPriceContainer}>
              <Icon name="wallet" size={18} color="#4A90E2" />
              <Text style={styles.hotelPrice}>
                {formatCurrency(hotel.estimatedPrice, currency)} per night
              </Text>
            </View>
          )}
          {isSelected && (
            <View style={styles.bookingLinksContainer}>
              {hotel.bookingLinks.booking &&
                hotel.bookingLinks.booking !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.booking)}
                  >
                    <Text style={styles.bookingButtonText}>Booking.com</Text>
                  </TouchableOpacity>
                )}
              {hotel.bookingLinks.expedia &&
                hotel.bookingLinks.expedia !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.expedia)}
                  >
                    <Text style={styles.bookingButtonText}>Expedia</Text>
                  </TouchableOpacity>
                )}
              {hotel.bookingLinks.agoda &&
                hotel.bookingLinks.agoda !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.agoda)}
                  >
                    <Text style={styles.bookingButtonText}>Agoda</Text>
                  </TouchableOpacity>
                )}
              {hotel.bookingLinks.hotels &&
                hotel.bookingLinks.hotels !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.hotels)}
                  >
                    <Text style={styles.bookingButtonText}>Hotels.com</Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );
};
