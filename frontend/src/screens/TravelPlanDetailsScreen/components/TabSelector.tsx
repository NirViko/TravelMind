import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

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
    label: "Itinerary",
    icon: "map-marker",
  },
  {
    value: "hotels",
    label: "Hotels",
    icon: "bed",
  },
  {
    value: "restaurants",
    label: "Restaurants",
    icon: "silverware-fork-knife",
  },
  {
    value: "transport",
    label: "Getting There",
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
  const handleTabPress = (tabValue: string) => {
    // Always switch to the clicked tab
    if (activeTab !== tabValue) {
      onTabChange(tabValue);
    }

    // If clicking the same tab that's already expanded, collapse it
    if (activeTab === tabValue && isExpanded) {
      onToggle();
      return;
    }

    // Otherwise, expand the tabs
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
          <TouchableOpacity
            key={tab.value}
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
        );
      })}
    </View>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 16,
    padding: 4,
    minHeight: 50,
  },
  containerExpanded: {
    padding: 6,
    minHeight: 50,
  },
  containerMinimized: {
    padding: 4,
    minHeight: 40,
    marginTop: 8,
    marginBottom: 0,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  tabExpanded: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabMinimized: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
