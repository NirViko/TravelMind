import React from "react";
import { ScrollView } from "react-native";
import { Destination } from "../../../types/travel";
import { DestinationCard } from "./DestinationCard";
import { styles } from "../styles";

interface ItineraryTabProps {
  sortedItinerary: Destination[];
  expandedDestination: number | null;
  currency: string;
  imageErrors: Set<string>;
  onToggleDestination: (visitOrder: number) => void;
  onImageError: (url: string) => void;
  cityName?: string;
}

export const ItineraryTab: React.FC<ItineraryTabProps> = ({
  sortedItinerary,
  expandedDestination,
  currency,
  imageErrors,
  onToggleDestination,
  onImageError,
  cityName,
}) => {
  return (
    <ScrollView style={styles.tabContent}>
      {sortedItinerary.map((destination, index) => (
        <DestinationCard
          key={index}
          destination={destination}
          isExpanded={expandedDestination === destination.visitOrder}
          currency={currency}
          imageErrors={imageErrors}
          onToggle={() => onToggleDestination(destination.visitOrder)}
          onImageError={onImageError}
          cityName={cityName}
        />
      ))}
    </ScrollView>
  );
};

