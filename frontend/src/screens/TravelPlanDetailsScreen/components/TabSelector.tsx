import React, { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { tabStyles } from "./styles/TabSelector.styles";
import { STRINGS } from "../../../constants/strings";

interface TabSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isExpanded: boolean;
  isMapExpanded: boolean;
  onToggle: () => void;
}

const tabs = [
  {
    value: "itinerary",
    label: STRINGS.itinerary,
    icon: "map-marker",
  },
  {
    value: "hotels",
    label: STRINGS.hotels,
    icon: "bed",
  },
  {
    value: "restaurants",
    label: STRINGS.restaurants,
    icon: "silverware-fork-knife",
  },
  {
    value: "transport",
    label: STRINGS.gettingThere,
    icon: "train",
  },
];

export const TabSelector: React.FC<TabSelectorProps> = ({
  activeTab,
  onTabChange,
  isExpanded,
  isMapExpanded,
  onToggle,
}) => {
  const scaleAnimations = useRef(
    tabs.reduce((acc, tab) => {
      acc[tab.value] = new Animated.Value(1);
      return acc;
    }, {} as Record<string, Animated.Value>)
  ).current;

  const handleTabPress = (tabValue: string) => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnimations[tabValue], {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnimations[tabValue], {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
    ]).start();

    if (activeTab !== tabValue) {
      onTabChange(tabValue);
    }

    if (activeTab === tabValue && isExpanded) {
      onToggle();
      return;
    }

    if (!isExpanded) {
      onToggle();
    }
  };

  const isMinimized = isMapExpanded;

  return (
    <View
      style={[
        tabStyles.container,
        isExpanded && !isMinimized && tabStyles.containerExpanded,
        isMinimized && tabStyles.containerMinimized,
        isMinimized && { marginTop: 0 },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <Animated.View
            key={tab.value}
            style={{
              transform: [{ scale: scaleAnimations[tab.value] }],
            }}
          >
            <TouchableOpacity
              style={[
                tabStyles.tab,
                isActive && tabStyles.activeTab,
                isExpanded && !isMinimized && tabStyles.tabExpanded,
                isMinimized && tabStyles.tabMinimized,
              ]}
              onPress={() => handleTabPress(tab.value)}
              activeOpacity={0.7}
            >
              <Icon
                name={tab.icon}
                size={isMinimized ? 18 : isExpanded ? 20 : 20}
                color={isActive ? "#4A90E2" : "#666666"}
              />
            </TouchableOpacity>
          </Animated.View>
        );
      })}
    </View>
  );
};
