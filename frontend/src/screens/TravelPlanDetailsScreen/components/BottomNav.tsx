import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./BottomNav.styles";

type BottomTab = "timeline" | "explore";

interface BottomNavProps {
  activeTab: BottomTab;
  onTabChange: (tab: BottomTab) => void;
}

const TABS: { id: BottomTab | "edit" | "add"; label: string; icon: string }[] = [
  { id: "explore", label: "Explore", icon: "compass-outline" },
  { id: "timeline", label: "Timeline", icon: "format-list-bulleted-square" },
  { id: "edit", label: "Edit", icon: "pencil-outline" },
  { id: "add", label: "Add", icon: "plus" },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
      {TABS.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tab}
            onPress={() => {
              if (tab.id === "timeline" || tab.id === "explore") {
                onTabChange(tab.id);
              }
            }}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
              <MaterialCommunityIcons
                name={tab.icon as any}
                size={22}
                color={active ? "#85adff" : "#4a4a4a"}
              />
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

