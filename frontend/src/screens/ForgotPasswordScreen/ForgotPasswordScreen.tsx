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
import { validateEmail } from "../../utils/validation";

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onBack,
  onSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendResetEmail = async () => {
    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await AuthService.sendPasswordResetEmail(email);
      if (result.success) {
        setEmailSent(true);
        Alert.alert(
          "Email Sent",
          "We've sent a password reset link to your email. Please check your inbox and follow the instructions."
        );
      } else {
        setError(result.error || "Failed to send password reset email");
        Alert.alert("Error", result.error || "Failed to send password reset email");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send password reset email";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Icon name="arrow-right" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <Icon name="email-outline" size={80} color="#4A90E2" />
            </View>

            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a password reset link to:
            </Text>
            <Text style={styles.email}>{email}</Text>
            <Text style={styles.instructions}>
              Please check your inbox and click the link to reset your password.
              If you don't see the email, check your spam folder.
            </Text>

            <Button
              mode="contained"
              onPress={onBack}
              style={styles.button}
              contentStyle={{ paddingVertical: 8 }}
              labelStyle={styles.buttonText}
            >
              Back to Sign In
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

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

          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your
            password.
          </Text>

          <View style={styles.formCard}>
            <View>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="Email *"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) {
                    setError(null);
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>

            <Button
              mode="contained"
              onPress={handleSendResetEmail}
              style={styles.button}
              contentStyle={{ paddingVertical: 8 }}
              labelStyle={styles.buttonText}
              icon={() =>
                isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Icon name="email-outline" size={20} color="#FFFFFF" />
                )
              }
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

