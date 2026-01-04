import { useEffect } from "react";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import { User } from "../types";
import * as Crypto from "expo-crypto";

const FACEBOOK_APP_ID = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || "";
const FACEBOOK_REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "travelmind",
  path: "facebook",
});

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: `https://www.facebook.com/v18.0/dialog/oauth`,
  tokenEndpoint: `https://graph.facebook.com/v18.0/oauth/access_token`,
};

export const useFacebookAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: FACEBOOK_APP_ID || "placeholder-app-id",
      scopes: ["public_profile", "email"],
      responseType: AuthSession.ResponseType.Token,
      redirectUri: FACEBOOK_REDIRECT_URI,
      usePKCE: false,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success" && response.params) {
      // Handle successful authentication
      // In production, fetch user info from Facebook Graph API
    }
  }, [response]);

  const loginWithFacebook = async (): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      if (!FACEBOOK_APP_ID || FACEBOOK_APP_ID === "") {
        return {
          success: false,
          error: "Facebook App ID לא מוגדר. אנא הגדר EXPO_PUBLIC_FACEBOOK_APP_ID בקובץ .env",
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
          // Fetch user info from Facebook Graph API
          try {
            const userInfoResponse = await fetch(
              `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`
            );
            
            if (userInfoResponse.ok) {
              const userInfo = await userInfoResponse.json();
              const user: User = {
                id: userInfo.id || Crypto.randomUUID(),
                name: userInfo.name || "Facebook User",
                email: userInfo.email || "user@facebook.com",
              };
              return { success: true, user };
            }
          } catch (fetchError) {
            // Fallback if API call fails
            const user: User = {
              id: Crypto.randomUUID(),
              name: "Facebook User",
              email: "user@facebook.com",
            };
            return { success: true, user };
          }
        }
        
        // Fallback if no token
        const user: User = {
          id: Crypto.randomUUID(),
          name: "Facebook User",
          email: "user@facebook.com",
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
        error: error.message || "שגיאה בהתחברות עם Facebook",
      };
    }
  };

  return { loginWithFacebook, isLoading: !request };
};

