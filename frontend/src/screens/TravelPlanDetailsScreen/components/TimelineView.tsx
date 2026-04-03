import React from "react";
import { View, Text } from "react-native";
import { TimelineItem } from "../hooks/useNocturnalItinerary";
import { TransitLabel } from "../../../utils/itineraryTime";
import { TimelineActivityCard } from "./TimelineActivityCard";
import { TimelineTransitConnector } from "./TimelineTransitConnector";
import { styles } from "./TimelineView.styles";

interface TimelineViewProps {
  items: TimelineItem[];
  transitLabels: TransitLabel[];
  onItemPress: (item: TimelineItem) => void;
}

export function TimelineView({
  items,
  transitLabels,
  onItemPress,
}: TimelineViewProps) {
  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No activities for this day</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <View key={item.id}>
          <TimelineActivityCard item={item} onPress={() => onItemPress(item)} />
          {i < items.length - 1 && (
            <TimelineTransitConnector transit={transitLabels[i]} />
          )}
        </View>
      ))}
    </View>
  );
}
