import { Platform } from "react-native";

// You can override the API URL by setting this environment variable
// For physical devices, set your computer's local IP address
// Example: "http://192.168.1.100:3000/api"
const CUSTOM_API_URL = process.env.EXPO_PUBLIC_API_URL;

// Get the correct API URL based on platform
const getApiBaseUrl = (): string => {
  // Allow custom override via environment variable
  if (CUSTOM_API_URL) {
    console.log("Using custom API URL:", CUSTOM_API_URL);
    return CUSTOM_API_URL;
  }

  if (!__DEV__) {
    return "https://your-production-api.com/api";
  }

  // For development, use platform-specific URLs
  if (Platform.OS === "android") {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    const url = "http://10.0.2.2:3000/api";
    console.log("Using Android API URL:", url);
    return url;
  } else if (Platform.OS === "ios") {
    // iOS simulator - use localhost, but if it doesn't work,
    // set EXPO_PUBLIC_API_URL to your local IP (e.g., http://192.168.0.105:3000/api)
    // You can find your IP with: ifconfig | grep "inet " | grep -v 127.0.0.1
    const url = CUSTOM_API_URL || "http://localhost:3000/api";
    console.log("Using iOS API URL:", url);
    console.log(
      "💡 Tip: If connection fails, set EXPO_PUBLIC_API_URL in .env file"
    );
    return url;
  } else {
    // Web or other platforms
    const url = "http://localhost:3000/api";
    console.log("Using Web API URL:", url);
    return url;
  }
};

const API_BASE_URL = getApiBaseUrl();

export const apiClient = {
  baseURL: API_BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    try {
      console.log(`[API] GET ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `API Error: ${response.statusText} (${response.status})`
        );
      }
      return response.json();
    } catch (error: any) {
      if (
        error.message.includes("Network request failed") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        const baseUrl = API_BASE_URL.replace("/api", "");
        const platform = Platform.OS;
        let helpMessage = `\n\nTroubleshooting:\n`;
        helpMessage += `1. Make sure the backend server is running: cd backend && npm run dev\n`;
        helpMessage += `2. Current platform: ${platform}\n`;
        helpMessage += `3. Trying to connect to: ${baseUrl}\n`;

        if (platform === "ios") {
          helpMessage += `4. For iOS Simulator, try using your local IP:\n`;
          helpMessage += `   Create .env file in frontend/ with:\n`;
          helpMessage += `   EXPO_PUBLIC_API_URL=http://192.168.0.105:3000/api\n`;
          helpMessage += `   (Replace 192.168.0.105 with your computer's IP)\n`;
        } else if (platform === "android") {
          helpMessage += `4. For Android Emulator, using: http://10.0.2.2:3000\n`;
          helpMessage += `5. Make sure backend listens on 0.0.0.0\n`;
        }

        throw new Error(`Cannot connect to server at ${baseUrl}${helpMessage}`);
      }
      throw error;
    }
  },

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      console.log(`[API] POST ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `API Error: ${response.statusText} (${response.status})`
        );
      }
      return response.json();
    } catch (error: any) {
      if (
        error.message.includes("Network request failed") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        const baseUrl = API_BASE_URL.replace("/api", "");
        const platform = Platform.OS;
        let helpMessage = `\n\nTroubleshooting:\n`;
        helpMessage += `1. Make sure the backend server is running: cd backend && npm run dev\n`;
        helpMessage += `2. Current platform: ${platform}\n`;
        helpMessage += `3. Trying to connect to: ${baseUrl}\n`;

        if (platform === "ios") {
          helpMessage += `4. For iOS Simulator, try using your local IP:\n`;
          helpMessage += `   Create .env file in frontend/ with:\n`;
          helpMessage += `   EXPO_PUBLIC_API_URL=http://192.168.0.105:3000/api\n`;
          helpMessage += `   (Replace 192.168.0.105 with your computer's IP)\n`;
        } else if (platform === "android") {
          helpMessage += `4. For Android Emulator, using: http://10.0.2.2:3000\n`;
          helpMessage += `5. Make sure backend listens on 0.0.0.0\n`;
        }

        throw new Error(`Cannot connect to server at ${baseUrl}${helpMessage}`);
      }
      throw error;
    }
  },
};
