import React from "react";
import { View, ImageBackground, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

interface OnboardingScreenProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onGetStarted,
  onLogin,
}) => {
  // Image of vintage van on beach - matching the design
  const backgroundImage = {
    uri: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.logo}>TravelMind</Text>
          
          <Text style={styles.title}>Explore your journey only with us</Text>
          <Text style={styles.subtitle}>
            All your vacations destinations are here, enjoy your holiday.
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={onGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.getStartedText}>Get started</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onLogin} activeOpacity={0.7}>
              <Text style={styles.loginText}>or Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};
