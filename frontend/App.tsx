import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { AppProviders } from "./src/providers";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

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
        <HomeScreen />
      )}
    </AppProviders>
  );
}
