import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { titleStyles } from "./styles/TabTitle.styles";
import { STRINGS } from "../../../constants/strings";

interface TabTitleProps {
  activeTab: string;
}

const tabInfo: Record<
  string,
  { label: string; icon: keyof typeof Icon.glyphMap }
> = {
  itinerary: {
    label: STRINGS.itinerary,
    icon: "map-marker",
  },
  hotels: {
    label: STRINGS.hotels,
    icon: "bed",
  },
  restaurants: {
    label: STRINGS.restaurants,
    icon: "silverware-fork-knife",
  },
  transport: {
    label: STRINGS.gettingThere,
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
