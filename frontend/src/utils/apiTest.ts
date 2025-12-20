import { Platform } from "react-native";

/**
 * Test API connection
 */
export const testApiConnection = async (baseUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl.replace("/api", "")}/health`, {
      method: "GET",
      timeout: 5000,
    } as any);
    return response.ok;
  } catch (error) {
    console.error("API connection test failed:", error);
    return false;
  }
};

/**
 * Get suggested API URLs based on platform
 */
export const getSuggestedApiUrls = (): string[] => {
  const urls: string[] = [];

  if (Platform.OS === "android") {
    urls.push("http://10.0.2.2:3000/api");
  } else if (Platform.OS === "ios") {
    urls.push("http://127.0.0.1:3000/api");
    urls.push("http://localhost:3000/api");
  } else {
    urls.push("http://localhost:3000/api");
    urls.push("http://127.0.0.1:3000/api");
  }

  return urls;
};

