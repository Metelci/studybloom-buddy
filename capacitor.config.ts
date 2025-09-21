import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.248cc5dccf8c4df3a968d2f1a1f99658',
  appName: 'studybloom-buddy',
  webDir: 'dist',
  server: {
    url: 'https://248cc5dc-cf8c-4df3-a968-d2f1a1f99658.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF"
    }
  }
};

export default config;