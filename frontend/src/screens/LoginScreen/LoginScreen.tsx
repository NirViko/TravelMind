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
  const { login } = useAuthStore();

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
        // Check if email confirmation is needed
        const response = result as any;
        const sessionToken = response.session?.access_token || null;

        if (
          isSignUp &&
          (response.needsEmailConfirmation || !result.user.emailVerified)
        ) {
          // Save session token for verification checks
          if (sessionToken) {
            useAuthStore.getState().setSession(sessionToken);
          }
          // Show email verification screen
          setUserEmail(result.user.email);
          setNeedsVerification(true);
        } else {
          await login(result.user, sessionToken);
          onLogin();
        }
      } else {
        Alert.alert(
          isSignUp ? "Sign Up Failed" : "Login Failed",
          result.error ||
            (isSignUp ? "Failed to create account" : "Invalid credentials")
        );
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || (isSignUp ? "Failed to sign up" : "Failed to login")
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

  // Show email verification screen if needed
  if (needsVerification) {
    return (
      <EmailVerificationScreen
        email={userEmail}
        onVerified={async () => {
          // Re-check user status and login
          const checkResult = await AuthService.checkEmailVerification();
          if (checkResult.verified) {
            // Get user info again
            const loginResult = await AuthService.loginWithEmail(
              email,
              password
            );
            if (loginResult.success && loginResult.user) {
              const response = loginResult as any;
              const sessionToken = response.session?.access_token || null;
              await login(loginResult.user, sessionToken);
              setNeedsVerification(false);
              onLogin();
            }
          }
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
              <TouchableOpacity>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
