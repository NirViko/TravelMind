import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./NocturnalFAB.styles";

interface NocturnalFABProps {
  onPress: () => void;
}

export function NocturnalFAB({ onPress }: NocturnalFABProps) {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
      <MaterialCommunityIcons name="plus" size={28} color="#0e0e0e" />
    </TouchableOpacity>
  );
}

