import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { styles } from "./styles";
import { AuthService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

interface EmailVerificationScreenProps {
  email: string;
  onVerified: () => void;
  onGoToLogin?: () => void;
  onResend?: () => void;
}

export const EmailVerificationScreen: React.FC<
  EmailVerificationScreenProps
> = ({ email, onVerified, onGoToLogin, onResend }) => {
  const [isResending, setIsResending] = useState(false);
  const { user, setUser } = useAuthStore();

  const handleGoToLogin = () => {
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      onVerified(); // Fallback to onVerified if onGoToLogin not provided
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Pass email to resend verification (works even without token)
      const result = await AuthService.resendVerificationEmail(email);
      if (result.success) {
        Alert.alert(
          "Email Sent",
          "A new verification email has been sent to your inbox. Please check your email."
        );
        if (onResend) {
          onResend();
        }
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to resend verification email"
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to resend verification email"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Account Created Successfully!</Text>
        <Text style={styles.subtitle}>We've sent a verification email to:</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.instructions}>
          Please check your inbox and click the verification link to activate
          your account. After verification, you can sign in.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGoToLogin}
            disabled={isResending}
          >
            <Icon name="login" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleResendEmail}
          disabled={isResending}
          style={styles.resendLink}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#4A90E2" />
          ) : (
            <Text style={styles.resendLinkText}>Resend Verification Email</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
