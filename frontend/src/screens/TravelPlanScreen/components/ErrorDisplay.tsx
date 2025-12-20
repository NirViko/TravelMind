import React from "react";
import { Card, Text } from "react-native-paper";
import { styles } from "../styles";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Card style={styles.errorCard}>
      <Card.Content>
        <Text variant="titleSmall" style={styles.errorTitle}>
          Error:
        </Text>
        <Text variant="bodyMedium" style={styles.errorText}>
          {error}
        </Text>
      </Card.Content>
    </Card>
  );
};

