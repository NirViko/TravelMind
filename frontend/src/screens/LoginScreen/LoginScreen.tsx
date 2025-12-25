import React, { useState } from "react";
import {
  View,
  TextInput,
  ImageBackground,
  Text,
  TouchableOpacity,
} from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { styles } from "./styles";

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

  const backgroundImage = {
    uri: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200",
  };

  const handleLogin = () => {
    // Handle login logic here
    onLogin();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={styles.content}>
        <TouchableOpacity
          onPress={onBack}
          style={{ position: "absolute", top: 20, left: 24, zIndex: 10 }}
        >
          <Icon name="arrow-left" size={24} color="#4A90E2" />
        </TouchableOpacity>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>

        <View style={styles.formCard}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
            labelStyle={styles.buttonText}
            icon={() => <Icon name="login" size={20} color="#FFFFFF" />}
          >
            Sign In
          </Button>

          <TouchableOpacity>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
