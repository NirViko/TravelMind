import React from "react";
import { ScrollView, View, Text } from "react-native";
import { DayCard } from "./DayCard";
import { styles } from "../styles";
import { TravelPlan, Destination } from "../../../types/travel";

interface DaySectionProps {
  travelPlan: TravelPlan;
  sortedItinerary: Destination[];
}

export const DaySection: React.FC<DaySectionProps> = ({
  travelPlan,
  sortedItinerary,
}) => {
  // Group destinations by day (simplified - you might want to use actual dates)
  const dayGroups: { [key: number]: Destination[] } = {};
  sortedItinerary.forEach((dest) => {
    const day = Math.ceil(dest.visitOrder / 3); // Assuming ~3 destinations per day
    if (!dayGroups[day]) {
      dayGroups[day] = [];
    }
    dayGroups[day].push(dest);
  });

  return (
    <ScrollView style={styles.listContainer}>
      {Object.entries(dayGroups).map(([day, destinations]) => (
        <View key={day} style={styles.daySection}>
          <Text style={styles.dayTitle}>
            Day {day} - {travelPlan.destination}
          </Text>
          {destinations.map((dest, index) => (
            <DayCard
              key={index}
              type="DESTINATION"
              title={dest.title}
              description={dest.description}
              imageUrl={dest.imageUrl || undefined}
            />
          ))}
          {/* Add hotel card for this day if available */}
          {travelPlan.hotels && travelPlan.hotels[parseInt(day) - 1] && (
            <DayCard
              type="HOTEL"
              title={travelPlan.hotels[parseInt(day) - 1].name}
              description={travelPlan.hotels[parseInt(day) - 1].description}
            />
          )}
        </View>
      ))}
    </ScrollView>
  );
};

