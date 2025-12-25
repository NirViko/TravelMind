import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { styles } from "./styles/MapButton.styles";
import { STRINGS } from "../../../constants/strings";

interface MapButtonProps {
  onPress: () => void;
  isMapVisible: boolean;
}

export const MapButton: React.FC<MapButtonProps> = ({
  onPress,
  isMapVisible,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, isMapVisible && styles.buttonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <Icon
          name={isMapVisible ? "map" : "map-outline"}
          size={24}
          color={isMapVisible ? "#FFFFFF" : "#4A90E2"}
        />
      </View>
      <Text
        style={[styles.buttonText, isMapVisible && styles.buttonTextActive]}
      >
        {isMapVisible ? STRINGS.hideMap : STRINGS.showRoute}
      </Text>
    </TouchableOpacity>
  );
};
