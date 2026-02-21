import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { styles } from "./styles";
import { AuthService } from "../../services/authService";
import { validatePassword } from "../../utils/validation";

interface ResetPasswordScreenProps {
  token: string;
  onSuccess: () => void;
  onBack: () => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  token,
  onSuccess,
  onBack,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Password validation
    const passwordError = validatePassword(password, true);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.resetPassword(token, password);
      if (result.success) {
        Alert.alert(
          "Success",
          "Your password has been reset successfully. You can now sign in with your new password.",
          [
            {
              text: "OK",
              onPress: onSuccess,
            },
          ]
        );
      } else {
        Alert.alert("Error", result.error || "Failed to reset password");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-right" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <Icon name="lock-reset" size={80} color="#4A90E2" />
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your new password below.
          </Text>

          <View style={styles.formCard}>
            <View>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder="New Password (min 8 chars) *"
                placeholderTextColor="#999999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors({ ...errors, password: undefined });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              {!errors.password && password.length > 0 && (
                <Text style={styles.hintText}>
                  Must contain: uppercase, lowercase, number (min 8 chars)
                </Text>
              )}
            </View>

            <View>
              <TextInput
                style={[
                  styles.input,
                  errors.confirmPassword && styles.inputError,
                ]}
                placeholder="Confirm Password *"
                placeholderTextColor="#999999"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) {
                    setErrors({ ...errors, confirmPassword: undefined });
                  }
                }}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.confirmPassword && (
                <Text style={styles.errorText}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleResetPassword}
              style={styles.button}
              contentStyle={{ paddingVertical: 8 }}
              labelStyle={styles.buttonText}
              icon={() =>
                isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Icon name="lock-check" size={20} color="#FFFFFF" />
                )
              }
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

