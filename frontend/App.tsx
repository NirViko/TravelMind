import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { AppProviders } from "./src/providers";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  // Step 1: Check authentication on app startup
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Handle onboarding - only show once
  useEffect(() => {
    // You can store this in AsyncStorage if you want to persist it
    // For now, we'll skip onboarding if user is authenticated
    if (!isLoading && isAuthenticated) {
      setHasSeenOnboarding(true);
    }
  }, [isLoading, isAuthenticated]);

  // Show loading screen during auth check
  if (isLoading) {
    return (
      <AppProviders>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1A1A1A" }}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={{ marginTop: 16, color: "#CCCCCC", fontSize: 16 }}>
            Loading...
          </Text>
        </View>
      </AppProviders>
    );
  }

  // Step 6: Route Protection - Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Show onboarding first time, then login
    if (!hasSeenOnboarding) {
      return (
        <AppProviders>
          <StatusBar style="light" />
          <OnboardingScreen
            onGetStarted={() => setHasSeenOnboarding(true)}
            onLogin={() => setHasSeenOnboarding(true)}
          />
        </AppProviders>
      );
    }

    return (
      <AppProviders>
        <StatusBar style="light" />
        <LoginScreen
          onLogin={() => {
            // Login handled by authStore, will trigger re-render
          }}
          onBack={() => {
            // Can go back to onboarding if needed
            setHasSeenOnboarding(false);
          }}
        />
      </AppProviders>
    );
  }

  // Step 1: User is authenticated - show Search screen (HomeScreen)
  return (
    <AppProviders>
      <StatusBar style="light" />
      <HomeScreen
        onLogout={async () => {
          // Logout will be handled by authStore
          // This will trigger re-render and redirect to login
        }}
      />
    </AppProviders>
  );
}
