import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface MapButtonProps {
  onPress: () => void;
  isMapVisible: boolean;
}

export const MapButton: React.FC<MapButtonProps> = ({ onPress, isMapVisible }) => {
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
      <Text style={[styles.buttonText, isMapVisible && styles.buttonTextActive]}>
        {isMapVisible ? "Hide Map" : "Show Route"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonActive: {
    backgroundColor: "#4A90E2",
  },
  iconContainer: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A90E2",
  },
  buttonTextActive: {
    color: "#FFFFFF",
  },
});

