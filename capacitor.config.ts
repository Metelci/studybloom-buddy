import { CapacitorConfig } from '@capacitor/cli';

const isDev = process.env.NODE_ENV === 'development';

const config: CapacitorConfig = {
  appId: 'com.studybloom.buddy',
  appName: 'studybloom-buddy',
  webDir: 'dist',
  ...(isDev
    ? {
        server: {
          url: 'https://248cc5dc-cf8c-4df3-a968-d2f1a1f99658.lovableproject.com?forceHideBadge=true',
          cleartext: true,
        },
      }
    : {}),
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_notification',
      iconColor: '#488AFF',
    },
  },
};

export default config;
