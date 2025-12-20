import React from "react";
import { ScrollView } from "react-native";
import { Restaurant } from "../../../types/travel";
import { RestaurantCard } from "./RestaurantCard";
import { styles } from "../styles";

interface RestaurantsTabProps {
  restaurants: Restaurant[];
  imageErrors: Set<string>;
  onImageError: (url: string) => void;
}

export const RestaurantsTab: React.FC<RestaurantsTabProps> = ({
  restaurants,
  imageErrors,
  onImageError,
}) => {
  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  return (
    <ScrollView style={styles.tabContent}>
      {restaurants.map((restaurant, index) => (
        <RestaurantCard
          key={index}
          restaurant={restaurant}
          imageErrors={imageErrors}
          onImageError={onImageError}
        />
      ))}
    </ScrollView>
  );
};

