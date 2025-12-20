import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles";
import { TravelPlan } from "../../../types/travel";

interface HeaderSectionProps {
  travelPlan: TravelPlan;
  onBack?: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({
  travelPlan,
  onBack,
}) => {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{travelPlan.destination}</Text>
      </View>
    </View>
  );
};
