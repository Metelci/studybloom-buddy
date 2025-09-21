import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

// Storage keys for the app
export const STORAGE_KEYS = {
  STUDY_STREAK: 'study_streak',
  COMPLETED_TASKS: 'completed_tasks',
  USER_SETTINGS: 'user_settings',
  STUDY_GOALS: 'study_goals',
  WEEKLY_PROGRESS: 'weekly_progress',
  EXAM_DATES: 'exam_dates',
  STUDY_SESSIONS: 'study_sessions'
} as const;

class NativeStorageService {
  private isNative = Capacitor.isNativePlatform();

  async setItem(key: string, value: any): Promise<void> {
    try {
      if (this.isNative) {
        await Preferences.set({
          key,
          value: JSON.stringify(value)
        });
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Error setting storage item:', error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      let value: string | null;
      
      if (this.isNative) {
        const result = await Preferences.get({ key });
        value = result.value;
      } else {
        value = localStorage.getItem(key);
      }

      if (value === null) {
        return null;
      }

      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.isNative) {
        await Preferences.remove({ key });
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing storage item:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isNative) {
        await Preferences.clear();
      } else {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  async keys(): Promise<string[]> {
    try {
      if (this.isNative) {
        const result = await Preferences.keys();
        return result.keys;
      } else {
        return Object.keys(localStorage);
      }
    } catch (error) {
      console.error('Error getting storage keys:', error);
      return [];
    }
  }
}

export const nativeStorage = new NativeStorageService();