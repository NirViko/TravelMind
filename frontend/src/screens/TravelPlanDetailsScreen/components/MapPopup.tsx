import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles";

interface MapPopupProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  rating?: number;
  price?: string;
  onCheck?: () => void;
}

export const MapPopup: React.FC<MapPopupProps> = ({
  title,
  subtitle,
  imageUrl,
  rating,
  price,
  onCheck,
}) => {
  const defaultImage = {
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  };

  return (
    <View style={styles.popupCard}>
      {imageUrl && (
        <Image
          source={imageUrl ? { uri: imageUrl } : defaultImage}
          style={styles.popupImage}
          resizeMode="cover"
        />
      )}
      <Text style={styles.popupTitle}>{title}</Text>
      {subtitle && <Text style={styles.popupSubtitle}>{subtitle}</Text>}
      {rating !== undefined && (
        <Text style={styles.popupRating}>
          {"⭐".repeat(Math.floor(rating))} {rating.toFixed(1)}
        </Text>
      )}
      {price && <Text style={styles.popupPrice}>{price}</Text>}
      {onCheck && (
        <TouchableOpacity
          style={styles.popupButton}
          onPress={onCheck}
          activeOpacity={0.8}
        >
          <Text style={styles.popupButtonText}>CHECK</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

