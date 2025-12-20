import React from "react";
import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { styles } from "../styles";

interface LoadingIndicatorProps {
  isLoading: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isLoading,
}) => {
  if (!isLoading) return null;

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>
        AI is creating your perfect travel plan...
      </Text>
    </View>
  );
};

