import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface TabTitleProps {
  activeTab: string;
}

const tabInfo: Record<string, { label: string; icon: string }> = {
  itinerary: {
    label: "Itinerary",
    icon: "map-marker",
  },
  hotels: {
    label: "Hotels",
    icon: "bed",
  },
  restaurants: {
    label: "Restaurants",
    icon: "silverware-fork-knife",
  },
  transport: {
    label: "Getting There",
    icon: "train",
  },
};

export const TabTitle: React.FC<TabTitleProps> = ({ activeTab }) => {
  const tab = tabInfo[activeTab];
  if (!tab) return null;

  return (
    <View style={titleStyles.container}>
      <Icon name={tab.icon} size={24} color="#4A90E2" />
      <Text style={titleStyles.title}>{tab.label}</Text>
    </View>
  );
};

const titleStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
  },
});

