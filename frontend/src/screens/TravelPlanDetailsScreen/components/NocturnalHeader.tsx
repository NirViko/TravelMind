import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "./NocturnalHeader.styles";

interface NocturnalHeaderProps {
  destinationName: string;
  onBack?: () => void;
}

export function NocturnalHeader({ destinationName, onBack }: NocturnalHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.7}>
        <MaterialCommunityIcons name="chevron-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={1}>
        {destinationName}
      </Text>

      <View style={styles.avatar}>
        <MaterialCommunityIcons name="account-circle-outline" size={26} color="#adaaaa" />
      </View>
    </View>
  );
}

