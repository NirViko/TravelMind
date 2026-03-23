import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

interface EmptyTabScreenProps {
  icon: string;
  title: string;
  subtitle: string;
}

export const EmptyTabScreen: React.FC<EmptyTabScreenProps> = ({
  icon,
  title,
  subtitle,
}) => (
  <View style={styles.container}>
    <View style={styles.iconWrapper}>
      <Icon name={icon as any} size={48} color="#2A2A3A" />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 14,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#111118",
    borderWidth: 1,
    borderColor: "#1E1E2A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#555566",
    textAlign: "center",
    lineHeight: 22,
  },
});