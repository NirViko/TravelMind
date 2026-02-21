import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  setUser: (user: User | null) => void;
  setSession: (token: string | null) => void;
  setAuthError: (error: string | null) => void;
  login: (user: User, sessionToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

const STORAGE_KEY = "@travelmind_user";
const SESSION_KEY = "@travelmind_session";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionToken: null,
  isAuthenticated: false,
  isLoading: true,
  authError: null,
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user, authError: null });
  },
  setSession: (token: string | null) => {
    set({ sessionToken: token });
  },
  setAuthError: (error: string | null) => {
    set({ authError: error });
  },
  clearError: () => {
    set({ authError: null });
  },
  login: async (user: User, sessionToken?: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      if (sessionToken) {
        await AsyncStorage.setItem(SESSION_KEY, sessionToken);
        set({ user, sessionToken, isAuthenticated: true, authError: null });
      } else {
        set({ user, isAuthenticated: true, authError: null });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save authentication data";
      set({ authError: errorMessage });
      throw error;
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(SESSION_KEY);
      set({ 
        user: null, 
        sessionToken: null, 
        isAuthenticated: false, 
        authError: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to logout";
      set({ authError: errorMessage });
      throw error;
    }
  },
  loadUser: async () => {
    try {
      set({ isLoading: true, authError: null });
      const [userData, sessionData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SESSION_KEY),
      ]);
      if (userData) {
        const user = JSON.parse(userData);
        const sessionToken = sessionData || null;
        // Validate that we have both user and token for proper authentication
        if (user && sessionToken) {
          set({ 
            user, 
            sessionToken, 
            isAuthenticated: true, 
            isLoading: false,
            authError: null 
          });
        } else {
          // Invalid state - clear it
          await AsyncStorage.removeItem(STORAGE_KEY);
          await AsyncStorage.removeItem(SESSION_KEY);
          set({ 
            user: null, 
            sessionToken: null, 
            isAuthenticated: false, 
            isLoading: false,
            authError: null 
          });
        }
      } else {
        set({ 
          user: null, 
          sessionToken: null, 
          isAuthenticated: false, 
          isLoading: false,
          authError: null 
        });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      set({ 
        user: null, 
        sessionToken: null, 
        isAuthenticated: false, 
        isLoading: false,
        authError: null 
      });
    }
  },
}));

