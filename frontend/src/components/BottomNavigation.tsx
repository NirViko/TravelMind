import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles/BottomNavigation.styles";

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "favorites", label: "Favorites", icon: "❤️" },
  { id: "map", label: "Map", icon: "🗺️" },
  { id: "profile", label: "You", icon: "👤" },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{tab.icon}</Text>
          <Text
            style={[styles.label, activeTab === tab.id && styles.activeLabel]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
