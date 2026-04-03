import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TransitLabel } from "../../../utils/itineraryTime";
import { styles } from "./TimelineTransitConnector.styles";

interface TimelineTransitConnectorProps {
  transit: TransitLabel;
}

export function TimelineTransitConnector({
  transit,
}: TimelineTransitConnectorProps) {
  return (
    <View style={styles.row}>
      {/* Left column: vertical line segment */}
      <View style={styles.left}>
        <View style={styles.line} />
      </View>

      {/* Right column: transit pill */}
      <View style={styles.right}>
        <View style={styles.pill}>
          <MaterialCommunityIcons
            name={transit.icon === "walk" ? "walk" : "car-outline"}
            size={14}
            color="#adaaaa"
          />
          <Text style={styles.label}>{transit.label}</Text>
        </View>
      </View>
    </View>
  );
}
