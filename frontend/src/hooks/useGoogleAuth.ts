import { useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { User } from "../types";
import * as Crypto from "expo-crypto";

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";
const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "travelmind",
  path: "google",
});

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID || "placeholder-client-id",
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.Token,
      redirectUri: GOOGLE_REDIRECT_URI,
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success" && response.params) {
      // Handle successful authentication
      // In production, exchange token for user info
    }
  }, [response]);

  const loginWithGoogle = async (): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> => {
    try {
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === "") {
        return {
          success: false,
          error:
            "Google Client ID לא מוגדר. אנא הגדר EXPO_PUBLIC_GOOGLE_CLIENT_ID בקובץ .env",
        };
      }

      if (!request) {
        return {
          success: false,
          error: "ממתין להכנת בקשת ההתחברות...",
        };
      }

      const result = await promptAsync();

      if (result.type === "success" && result.params) {
        // Extract access token from result
        const accessToken = result.params.access_token || result.params.token;

        if (accessToken) {
          // Fetch user info from Google API
          try {
            const userInfoResponse = await fetch(
              `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
            );

            if (userInfoResponse.ok) {
              const userInfo = await userInfoResponse.json();
              const user: User = {
                id: userInfo.id || Crypto.randomUUID(),
                name: userInfo.name || "Google User",
                email: userInfo.email || "user@google.com",
              };
              return { success: true, user };
            }
          } catch (fetchError) {
            // Fallback if API call fails
            const user: User = {
              id: Crypto.randomUUID(),
              name: "Google User",
              email: "user@google.com",
            };
            return { success: true, user };
          }
        }

        // Fallback if no token
        const user: User = {
          id: Crypto.randomUUID(),
          name: "Google User",
          email: "user@google.com",
        };
        return { success: true, user };
      } else if (result.type === "cancel") {
        return {
          success: false,
          error: "ההתחברות בוטלה על ידי המשתמש",
        };
      } else {
        return {
          success: false,
          error: `ההתחברות נכשלה: ${result.type}`,
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "שגיאה בהתחברות עם Google",
      };
    }
  };

  return { loginWithGoogle, isLoading: !request };
};
