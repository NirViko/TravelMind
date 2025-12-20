import React from "react";
import { ScrollView } from "react-native";
import { Hotel } from "../../../types/travel";
import { HotelCard } from "./HotelCard";
import { styles } from "../styles";

interface HotelsTabProps {
  hotels: Hotel[];
  selectedHotelIndex: number;
  currency: string;
  onSelectHotel: (index: number) => void;
  cityName?: string;
}

export const HotelsTab: React.FC<HotelsTabProps> = ({
  hotels,
  selectedHotelIndex,
  currency,
  onSelectHotel,
  cityName,
}) => {
  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <ScrollView style={styles.tabContent}>
      {hotels.map((hotel, index) => (
        <HotelCard
          key={index}
          hotel={hotel}
          index={index}
          isSelected={selectedHotelIndex === index}
          currency={currency}
          onSelect={onSelectHotel}
          cityName={cityName}
        />
      ))}
    </ScrollView>
  );
};

