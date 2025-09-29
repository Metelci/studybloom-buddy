import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

export const useNativeFeatures = () => {
  const [isNative, setIsNative] = useState(false);
  const [notificationToken, setNotificationToken] = useState<string>('');

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    if (Capacitor.isNativePlatform()) {
      initializeLocalNotifications();
    }
  }, []);

  const initializeLocalNotifications = async () => {
    try {
      // Request permission for local notifications (Android 13+ needs runtime permission)
      await LocalNotifications.requestPermissions();

    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  // Device Storage Functions
  const setStorageItem = async (key: string, value: string) => {
    try {
      await Preferences.set({ key, value });
    } catch (error) {
      console.error('Error setting storage item:', error);
    }
  };

  const getStorageItem = async (key: string): Promise<string | null> => {
    try {
      const { value } = await Preferences.get({ key });
      return value;
    } catch (error) {
      console.error('Error getting storage item:', error);
      return null;
    }
  };

  const removeStorageItem = async (key: string) => {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Error removing storage item:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await Preferences.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  // Local Notification Functions
  const scheduleLocalNotification = async (title: string, body: string, triggerAt?: Date) => {
    try {
      const notification = {
        title,
        body,
        id: Date.now(),
        schedule: triggerAt ? { at: triggerAt } : undefined,
      };

      await LocalNotifications.schedule({
        notifications: [notification]
      });
    } catch (error) {
      console.error('Error scheduling local notification:', error);
    }
  };

  const scheduleStudyReminder = async (taskTitle: string, scheduledTime: Date) => {
    await scheduleLocalNotification(
      'Study Reminder 📚',
      `Time to work on: ${taskTitle}`,
      scheduledTime
    );
  };

  const scheduleStreakReminder = async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0); // 7 PM next day

    await scheduleLocalNotification(
      'Keep Your Streak! 🔥',
      'Don\'t forget to complete your study tasks today to maintain your streak!',
      tomorrow
    );
  };

  return {
    isNative,
    notificationToken,
    // Storage functions
    setStorageItem,
    getStorageItem,
    removeStorageItem,
    clearStorage,
    // Notification functions
    scheduleLocalNotification,
    scheduleStudyReminder,
    scheduleStreakReminder
  };
};
