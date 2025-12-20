import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface SearchHistoryItem {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  timestamp: number;
}

interface SearchHistoryState {
  history: SearchHistoryItem[];
  isLoading: boolean;
  loadHistory: () => Promise<void>;
  addSearch: (item: Omit<SearchHistoryItem, "id" | "timestamp">) => Promise<void>;
  removeSearch: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
}

const STORAGE_KEY = "@TravelMind:searchHistory";
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistoryStore = create<SearchHistoryState>((set, get) => ({
  history: [],
  isLoading: false,

  loadHistory: async () => {
    set({ isLoading: true });
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const history = JSON.parse(stored) as SearchHistoryItem[];
        set({ history, isLoading: false });
      } else {
        set({ history: [], isLoading: false });
      }
    } catch (error) {
      console.error("Error loading search history:", error);
      set({ history: [], isLoading: false });
    }
  },

  addSearch: async (item) => {
    try {
      const newItem: SearchHistoryItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };

      const currentHistory = get().history;
      
      // Remove duplicate if exists (same destination, dates, budget)
      const filteredHistory = currentHistory.filter(
        (h) =>
          !(
            h.destination === newItem.destination &&
            h.startDate === newItem.startDate &&
            h.endDate === newItem.endDate &&
            h.budget === newItem.budget
          )
      );

      // Add new item at the beginning and limit to MAX_HISTORY_ITEMS
      const updatedHistory = [newItem, ...filteredHistory].slice(
        0,
        MAX_HISTORY_ITEMS
      );

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      set({ history: updatedHistory });
    } catch (error) {
      console.error("Error saving search history:", error);
    }
  },

  removeSearch: async (id: string) => {
    try {
      const currentHistory = get().history;
      const updatedHistory = currentHistory.filter((item) => item.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      set({ history: updatedHistory });
    } catch (error) {
      console.error("Error removing search from history:", error);
    }
  },

  clearHistory: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      set({ history: [] });
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  },
}));

