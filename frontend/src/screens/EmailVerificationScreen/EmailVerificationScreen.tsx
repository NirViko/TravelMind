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
  onResend?: () => void;
}

export const EmailVerificationScreen: React.FC<
  EmailVerificationScreenProps
> = ({ email, onVerified, onResend }) => {
  const [isResending, setIsResending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { user, setUser } = useAuthStore();

  const checkVerificationStatus = async () => {
    setIsChecking(true);
    try {
      const result = await AuthService.checkEmailVerification();
      if (result.verified) {
        // Update user in store
        if (user) {
          const updatedUser = { ...user, emailVerified: true };
          await useAuthStore.getState().login(updatedUser);
        }
        onVerified();
      } else {
        Alert.alert(
          "Email Not Verified",
          "Please check your email and click the verification link."
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Failed to check verification status"
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const result = await AuthService.resendVerificationEmail();
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
          <Icon name="email-outline" size={80} color="#4A90E2" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>We've sent a verification email to:</Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.instructions}>
          Please check your inbox and click the verification link to activate
          your account.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={checkVerificationStatus}
            disabled={isChecking || isResending}
          >
            {isChecking ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.buttonText}>I've Verified My Email</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleResendEmail}
            disabled={isResending || isChecking}
          >
            {isResending ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : (
              <>
                <Icon name="email-send" size={20} color="#4A90E2" />
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Resend Verification Email
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.helpContainer}>
          <Icon name="help-circle-outline" size={16} color="#CCCCCC" />
          <Text style={styles.helpText}>
            Didn't receive the email? Check your spam folder or try resending.
          </Text>
        </View>
      </View>
    </View>
  );
};
