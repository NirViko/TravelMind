import { Linking, Alert, Platform } from "react-native";

/**
 * Safely open a URL with error handling
 */
export const openURL = async (url: string | null | undefined): Promise<boolean> => {
  if (!url || url === "N/A" || url === "null" || url.trim() === "") {
    Alert.alert("Error", "Invalid URL");
    return false;
  }

  // Ensure URL has a protocol
  let formattedUrl = url.trim();
  if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
    formattedUrl = `https://${formattedUrl}`;
  }

  try {
    const canOpen = await Linking.canOpenURL(formattedUrl);
    if (canOpen) {
      await Linking.openURL(formattedUrl);
      return true;
    } else {
      Alert.alert("Error", "Cannot open this URL");
      return false;
    }
  } catch (error: any) {
    console.error("Error opening URL:", error);
    Alert.alert("Error", `Failed to open URL: ${error.message || "Unknown error"}`);
    return false;
  }
};

/**
 * Validate if a URL is valid
 */
export const isValidURL = (url: string | null | undefined): boolean => {
  if (!url || url === "N/A" || url === "null" || url.trim() === "") {
    return false;
  }
  
  try {
    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    new URL(formattedUrl);
    return true;
  } catch {
    return false;
  }
};

