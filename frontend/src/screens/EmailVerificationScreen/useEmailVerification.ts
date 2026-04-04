import { useState } from "react";
import { Alert } from "react-native";
import { AuthService } from "../../services/authService";

interface UseEmailVerificationProps {
  email: string;
  onVerified: () => void;
  onGoToLogin?: () => void;
  onResend?: () => void;
}

interface UseEmailVerificationResult {
  isResending: boolean;
  handleGoToLogin: () => void;
  handleResendEmail: () => Promise<void>;
}

export function useEmailVerification({
  email,
  onVerified,
  onGoToLogin,
  onResend,
}: UseEmailVerificationProps): UseEmailVerificationResult {
  const [isResending, setIsResending] = useState(false);

  const handleGoToLogin = () => {
    if (onGoToLogin) {
      onGoToLogin();
    } else {
      onVerified();
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      const result = await AuthService.resendVerificationEmail(email);
      if (result.success) {
        Alert.alert(
          "Email Sent",
          "A new verification email has been sent to your inbox. Please check your email."
        );
        onResend?.();
      } else {
        Alert.alert("Error", result.error || "Failed to resend verification email");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to resend verification email";
      Alert.alert("Error", message);
    } finally {
      setIsResending(false);
    }
  };

  return { isResending, handleGoToLogin, handleResendEmail };
}
