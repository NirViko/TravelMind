import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { AppProviders } from "./src/providers";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        setShowOnboarding(false);
        setShowLogin(false);
      } else {
        // Show onboarding or login based on user preference
        // For now, show onboarding first
      }
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <AppProviders>
      <StatusBar style="auto" />
      {showOnboarding ? (
        <OnboardingScreen
          onGetStarted={() => setShowOnboarding(false)}
          onLogin={() => {
            setShowOnboarding(false);
            setShowLogin(true);
          }}
        />
      ) : showLogin ? (
        <LoginScreen
          onLogin={() => {
            setShowLogin(false);
          }}
          onBack={() => {
            setShowLogin(false);
            setShowOnboarding(true);
          }}
        />
      ) : (
        <HomeScreen
          onBack={() => {
            setShowLogin(true);
          }}
        />
      )}
    </AppProviders>
  );
}
