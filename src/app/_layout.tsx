import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';

SplashScreen.preventAutoHideAsync();

function checkLoggedIn(): boolean {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem('pasu_logged_in') === 'true';
    } catch {
      return false;
    }
  }
  return false;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  // Re-check auth every time route segments change
  useEffect(() => {
    if (!isReady) return;

    const loggedIn = checkLoggedIn();
    const inAuthPage = segments[0] === 'login' || segments[0] === 'register';

    if (!loggedIn && !inAuthPage) {
      router.replace('/login');
    } else if (loggedIn && inAuthPage) {
      router.replace('/');
    }
  }, [isReady, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Slot />
    </ThemeProvider>
  );
}
