import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { styles } from "./styles";
import { useEmailVerification } from "./useEmailVerification";

interface EmailVerificationScreenProps {
  email: string;
  onVerified: () => void;
  onGoToLogin?: () => void;
  onResend?: () => void;
}

export const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({
  email,
  onVerified,
  onGoToLogin,
  onResend,
}) => {
  const { isResending, handleGoToLogin, handleResendEmail } = useEmailVerification({
    email,
    onVerified,
    onGoToLogin,
    onResend,
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={80} color="#6B7FD4" />
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
            accessibilityRole="button"
            accessibilityLabel="Go to Sign In"
            accessibilityState={{ disabled: isResending }}
          >
            <Icon name="login" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleResendEmail}
          disabled={isResending}
          style={styles.resendLink}
          accessibilityRole="button"
          accessibilityLabel="Resend verification email"
          accessibilityState={{ disabled: isResending }}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#6B7FD4" />
          ) : (
            <Text style={styles.resendLinkText}>Resend Verification Email</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
