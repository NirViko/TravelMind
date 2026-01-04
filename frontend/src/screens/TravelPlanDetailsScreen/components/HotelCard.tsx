import React, { useState, useEffect, useRef } from "react";
import { View, Image, TouchableOpacity, Animated } from "react-native";
import { Text, Card, RadioButton } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { Hotel } from "../../../types/travel";
import { formatCurrency } from "../../../utils/currency";
import { getHotelImage, getDefaultHotelImage } from "../../../utils/images";
import { openURL } from "../../../utils/linking";
import { styles } from "../styles";
import { STRINGS } from "../../../constants/strings";

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
  
  // Animation refs
  const fadeAnimationRef = useRef(new Animated.Value(0));
  const scaleAnimationRef = useRef(new Animated.Value(0.95));
  const selectedScaleRef = useRef(new Animated.Value(1));
  
  const fadeAnimation = fadeAnimationRef.current;
  const scaleAnimation = scaleAnimationRef.current;
  const selectedScale = selectedScaleRef.current;

  const isValidImage =
    hotel.imageUrl &&
    hotel.imageUrl !== "null" &&
    hotel.imageUrl !== "N/A" &&
    hotel.imageUrl.trim() !== "" &&
    (hotel.imageUrl.startsWith("http") || hotel.imageUrl.startsWith("https")) &&
    !imageError;

  const imageUrl = isValidImage
    ? hotel.imageUrl!
    : getHotelImage(hotel.name, cityName);

  // Fade in animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimation, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();
  }, [index, fadeAnimation, scaleAnimation]);

  // Scale animation when selected
  useEffect(() => {
    Animated.spring(selectedScale, {
      toValue: isSelected ? 1.02 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [isSelected, selectedScale]);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnimation,
          transform: [{ scale: scaleAnimation }, { scale: selectedScale }],
        },
      ]}
    >
      <Card style={[styles.hotelCard, isSelected && styles.selectedHotelCard]}>
        <View style={styles.hotelCardWrapper}>
          <TouchableOpacity onPress={() => onSelect(index)} activeOpacity={0.9}>
            <View style={styles.hotelImageContainer}>
          <Image
            source={{ uri: imageError ? getDefaultHotelImage() : imageUrl }}
            style={styles.hotelImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
            onLoadStart={() => setImageError(false)}
          />
          {/* Overlay with radio and price */}
          <View style={styles.hotelImageOverlay}>
            <View style={styles.hotelRadioOverlay}>
              <RadioButton
                value={index.toString()}
                status={isSelected ? "checked" : "unchecked"}
                onPress={() => onSelect(index)}
                color="#4A90E2"
              />
            </View>
            {hotel.estimatedPrice && (
              <View style={styles.hotelPriceOverlay}>
                <Text style={styles.hotelPriceOverlayText}>
                  {formatCurrency(hotel.estimatedPrice, currency)}
                </Text>
                <Text style={styles.hotelPriceOverlaySubtext}>/night</Text>
              </View>
            )}
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
                {formatCurrency(hotel.estimatedPrice, currency)} {STRINGS.perNight}
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
                    <Text style={styles.bookingButtonText}>{STRINGS.bookingCom}</Text>
                  </TouchableOpacity>
                )}
              {hotel.bookingLinks.expedia &&
                hotel.bookingLinks.expedia !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.expedia)}
                  >
                    <Text style={styles.bookingButtonText}>{STRINGS.expedia}</Text>
                  </TouchableOpacity>
                )}
              {hotel.bookingLinks.agoda &&
                hotel.bookingLinks.agoda !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.agoda)}
                  >
                    <Text style={styles.bookingButtonText}>{STRINGS.agoda}</Text>
                  </TouchableOpacity>
                )}
              {hotel.bookingLinks.hotels &&
                hotel.bookingLinks.hotels !== "N/A" && (
                  <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => openURL(hotel.bookingLinks.hotels)}
                  >
                    <Text style={styles.bookingButtonText}>{STRINGS.hotelsCom}</Text>
                  </TouchableOpacity>
                )}
            </View>
          )}
        </Card.Content>
      </TouchableOpacity>
      </View>
    </Card>
    </Animated.View>
  );
};
