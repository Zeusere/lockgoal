import AsyncStorage from '@react-native-async-storage/async-storage';
import {StateStorage} from 'zustand/middleware';

// Zustand persistence adapter for AsyncStorage
export const zustandStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await AsyncStorage.removeItem(name);
  },
};

// Helper keys
export const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: '@lockgoal/onboarding_complete',
  GOAL_STORE: '@lockgoal/goal_store',
  APP_STORE: '@lockgoal/app_store',
  LOCALE: '@lockgoal/locale',
} as const;
