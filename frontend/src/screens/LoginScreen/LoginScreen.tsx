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
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./styles";
import { AuthService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import {
  validateEmail,
  validatePassword,
  validateName,
  validateDateOfBirth,
} from "../../utils/validation";
import { EmailVerificationScreen } from "../EmailVerificationScreen";
import { ForgotPasswordScreen } from "../ForgotPasswordScreen";

interface LoginScreenProps {
  onLogin: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onBack,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }>({});
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, setAuthError, clearError } = useAuthStore();

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Email validation
    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    // Password validation
    const passwordError = validatePassword(password, isSignUp);
    if (passwordError) newErrors.password = passwordError;

    // Sign up specific validations
    if (isSignUp) {
      const firstNameError = validateName(firstName, "First name");
      if (firstNameError) newErrors.firstName = firstNameError;

      const lastNameError = validateName(lastName, "Last name");
      if (lastNameError) newErrors.lastName = lastNameError;

      const dateOfBirthError = validateDateOfBirth(dateOfBirth);
      if (dateOfBirthError) newErrors.dateOfBirth = dateOfBirthError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Clear any previous errors
    clearError();
    setIsLoading(true);

    try {
      const result = isSignUp
        ? await AuthService.signUpWithEmail(
            email,
            password,
            `${firstName} ${lastName}`.trim(),
            firstName,
            lastName,
            dateOfBirth
          )
        : await AuthService.loginWithEmail(email, password);

      if (result.success && result.user) {
        // Check if email confirmation is needed (for signup)
        const sessionToken = result.session?.access_token || null;
        const needsEmailConfirmation = result.needsEmailConfirmation || false;

        if (
          isSignUp &&
          (needsEmailConfirmation || !result.user.emailVerified)
        ) {
          // Save session token for verification checks
          if (sessionToken) {
            useAuthStore.getState().setSession(sessionToken);
          }
          // Show email verification screen
          setUserEmail(result.user.email);
          setNeedsVerification(true);
          setIsLoading(false);
          return; // Don't proceed with login
        } else {
          // Step 2 & 3: Store token and update state
          await login(result.user, sessionToken);
          // Step 2 & 3: Redirect to Search screen (handled by App.tsx)
          onLogin();
        }
      } else {
        // Step 2 & 3: Handle errors
        // Check if email verification is needed (for login)
        const needsEmailVerification = result.needsEmailVerification || false;
        
        if (needsEmailVerification && !isSignUp) {
          // User tried to login but email is not verified
          // Show email verification screen with the email from the form
          setUserEmail(email);
          setNeedsVerification(true);
          setIsLoading(false);
          return;
        }
        
        const errorMessage = result.error ||
          (isSignUp ? "Failed to create account. Please try again." : "Invalid email or password. Please check your credentials.");
        setAuthError(errorMessage);
        Alert.alert(
          isSignUp ? "Sign Up Failed" : "Login Failed",
          errorMessage
        );
      }
    } catch (error: any) {
      // Step 2 & 3: Handle server errors
      const errorMessage = error.message || 
        (isSignUp ? "Failed to sign up. Please check your connection and try again." : "Failed to login. Please check your connection and try again.");
      setAuthError(errorMessage);
      Alert.alert(
        "Error",
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDateOfBirth(formattedDate);
      // Clear error when date is selected
      if (errors.dateOfBirth) {
        setErrors({ ...errors, dateOfBirth: undefined });
      }
    }
  };

  // Show forgot password screen
  if (showForgotPassword) {
    return (
      <ForgotPasswordScreen
        onBack={() => setShowForgotPassword(false)}
        onSuccess={() => setShowForgotPassword(false)}
      />
    );
  }

  // Show email verification screen if needed
  if (needsVerification) {
    return (
      <EmailVerificationScreen
        email={userEmail}
        onGoToLogin={() => {
          // Reset form and go back to login screen
          setNeedsVerification(false);
          setEmail("");
          setPassword("");
          setIsSignUp(false);
        }}
        onVerified={() => {
          // Fallback - should not be called
          setNeedsVerification(false);
          setIsSignUp(false);
        }}
        onResend={() => {
          // Optionally handle resend callback
        }}
      />
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
          <Text style={styles.title}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </Text>
          <Text style={styles.subtitle}>
            {isSignUp
              ? "Sign up to start your journey"
              : "Sign in to continue your journey"}
          </Text>

          <View style={styles.formCard}>
            {isSignUp && (
              <>
                <View>
                  <TextInput
                    style={[
                      styles.input,
                      errors.firstName && styles.inputError,
                    ]}
                    placeholder="First Name *"
                    placeholderTextColor="#999999"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (errors.firstName) {
                        setErrors({ ...errors, firstName: undefined });
                      }
                    }}
                    autoCapitalize="words"
                  />
                  {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                  )}
                </View>

                <View>
                  <TextInput
                    style={[styles.input, errors.lastName && styles.inputError]}
                    placeholder="Last Name *"
                    placeholderTextColor="#999999"
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      if (errors.lastName) {
                        setErrors({ ...errors, lastName: undefined });
                      }
                    }}
                    autoCapitalize="words"
                  />
                  {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                  )}
                </View>

                <View>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[
                      styles.input,
                      styles.dateInput,
                      errors.dateOfBirth && styles.inputError,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        !dateOfBirth && styles.datePlaceholder,
                      ]}
                    >
                      {dateOfBirth
                        ? new Date(dateOfBirth).toLocaleDateString()
                        : "Date of Birth *"}
                    </Text>
                    <Icon name="calendar" size={20} color="#CCCCCC" />
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={
                        dateOfBirth
                          ? new Date(dateOfBirth)
                          : new Date(2000, 0, 1)
                      }
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      onChange={handleDateChange}
                    />
                  )}
                  {errors.dateOfBirth && (
                    <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
                  )}
                </View>
              </>
            )}

            <View>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email *"
                placeholderTextColor="#999999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                placeholder={
                  isSignUp ? "Password (min 8 chars) *" : "Password *"
                }
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
              {isSignUp && !errors.password && password.length > 0 && (
                <Text style={styles.hintText}>
                  Must contain: uppercase, lowercase, number (min 8 chars)
                </Text>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              contentStyle={{ paddingVertical: 8 }}
              labelStyle={styles.buttonText}
              icon={() =>
                isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Icon
                    name={isSignUp ? "account-plus" : "login"}
                    size={20}
                    color="#FFFFFF"
                  />
                )
              }
              disabled={isLoading}
            >
              {isLoading
                ? isSignUp
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignUp
                ? "Sign Up"
                : "Sign In"}
            </Button>

            <View style={styles.switchContainer}>
              <Text style={styles.switchText}>
                {isSignUp
                  ? "Already have an account? "
                  : "Don't have an account? "}
              </Text>
              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.switchLink}>
                  {isSignUp ? "Sign In" : "Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>

            {!isSignUp && (
              <TouchableOpacity onPress={() => setShowForgotPassword(true)}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
