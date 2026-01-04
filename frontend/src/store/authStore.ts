import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";

interface AuthState {
  user: User | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (token: string | null) => void;
  login: (user: User, sessionToken?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

const STORAGE_KEY = "@travelmind_user";
const SESSION_KEY = "@travelmind_session";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  sessionToken: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user });
  },
  setSession: (token: string | null) => {
    set({ sessionToken: token });
  },
  login: async (user: User, sessionToken?: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      if (sessionToken) {
        await AsyncStorage.setItem(SESSION_KEY, sessionToken);
        set({ user, sessionToken, isAuthenticated: true });
      } else {
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await AsyncStorage.removeItem(SESSION_KEY);
      set({ user: null, sessionToken: null, isAuthenticated: false });
    } catch (error) {
      console.error("Error removing user:", error);
      throw error;
    }
  },
  loadUser: async () => {
    try {
      const [userData, sessionData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SESSION_KEY),
      ]);
      if (userData) {
        const user = JSON.parse(userData);
        const sessionToken = sessionData || null;
        set({ user, sessionToken, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, sessionToken: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      set({ user: null, sessionToken: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

