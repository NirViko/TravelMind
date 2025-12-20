import React from "react";
import { View, Image, Text } from "react-native";
import { styles } from "../styles";

interface DayCardProps {
  type: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export const DayCard: React.FC<DayCardProps> = ({
  type,
  title,
  description,
  imageUrl,
}) => {
  const defaultImage = {
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
  };

  return (
    <View style={styles.dayCard}>
      {imageUrl && (
        <Image
          source={imageUrl ? { uri: imageUrl } : defaultImage}
          style={styles.dayCardImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.dayCardContent}>
        <Text style={styles.dayCardType}>{type}</Text>
        <Text style={styles.dayCardTitle}>{title}</Text>
        <Text style={styles.dayCardDescription}>{description}</Text>
      </View>
    </View>
  );
};

