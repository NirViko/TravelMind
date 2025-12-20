import React from "react";
import { View, Platform, TouchableOpacity } from "react-native";
import { Text, Button } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "../styles";

interface DatePickerInputProps {
  label: string;
  date: Date;
  onDateChange: (event: any, selectedDate?: Date) => void;
  showPicker: boolean;
  onTogglePicker: () => void;
  minimumDate?: Date;
  disabled?: boolean;
  formatDate: (date: Date) => string;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  label,
  date,
  onDateChange,
  showPicker,
  onTogglePicker,
  minimumDate,
  disabled,
  formatDate,
}) => {
  return (
    <>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>
      <TouchableOpacity
        onPress={onTogglePicker}
        disabled={disabled}
      >
        <View style={styles.dateInput}>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
          <Text style={styles.dateIcon}>📅</Text>
        </View>
      </TouchableOpacity>
      {showPicker && (
        <>
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            minimumDate={minimumDate}
          />
          {Platform.OS === "ios" && (
            <View style={styles.iosPickerButtons}>
              <Button onPress={onTogglePicker}>Cancel</Button>
              <Button mode="contained" onPress={onTogglePicker}>
                Done
              </Button>
            </View>
          )}
        </>
      )}
    </>
  );
};

