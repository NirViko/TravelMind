import { Platform } from "react-native";

// You can override the API URL by setting EXPO_PUBLIC_API_URL in .env
const CUSTOM_API_URL = process.env.EXPO_PUBLIC_API_URL;

// Get the correct API URL based on platform
const getApiBaseUrl = (): string => {
  // Allow custom override via environment variable
  if (CUSTOM_API_URL) {
    return CUSTOM_API_URL;
  }

  if (!__DEV__) {
    return "https://your-production-api.com/api";
  }

  // For development, use platform-specific URLs
  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return "http://10.0.2.2:3000/api";
  } else if (Platform.OS === "ios") {
    // iOS simulator - use 127.0.0.1 (more reliable than localhost)
    return "http://127.0.0.1:3000/api";
  } else {
    // Web or other platforms
    return "http://localhost:3000/api";
  }
};

// App constants
export const APP_NAME = "TravelMind";
export const API_BASE_URL = getApiBaseUrl();

export const COLORS = {
  primary: "#6200ee",
  secondary: "#03dac6",
  error: "#b00020",
  background: "#ffffff",
  surface: "#ffffff",
  text: "#000000",
};
