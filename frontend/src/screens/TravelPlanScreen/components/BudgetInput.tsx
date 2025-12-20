import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "react-native-paper";
import { styles } from "../styles";
import { getCurrencyForDestination } from "../../../utils/currency";

interface BudgetInputProps {
  budget: string;
  destination: string;
  onBudgetChange: (value: string) => void;
  disabled?: boolean;
}

export const BudgetInput: React.FC<BudgetInputProps> = ({
  budget,
  destination,
  onBudgetChange,
  disabled,
}) => {
  const currency = destination ? getCurrencyForDestination(destination) : "USD";

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder={`Budget (${currency})`}
        value={budget}
        onChangeText={onBudgetChange}
        keyboardType="numeric"
        editable={!disabled}
      />
      {destination && (
        <Text variant="bodySmall" style={styles.currencyHint}>
          Currency: {currency}
        </Text>
      )}
    </View>
  );
};

