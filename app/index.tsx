import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from '@/components/SplashScreen';
import { useAuth } from '@clerk/clerk-expo';

export default function Index() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const { isSignedIn, sessionId, isLoaded } = useAuth();

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
        setIsFirstTime(!hasSeenSplash);
      } catch (error) {
        console.error('Error checking first time:', error);
        setIsFirstTime(false);
      }
    };

    checkFirstTime();
  }, []);

  // Wait for auth to load
  if (!isLoaded) {
    return <SplashScreen />;
  }

  // Check for valid session
  if (isSignedIn && sessionId) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Show splash screen only for first-time users who are not signed in
  if (isFirstTime === null) {
    return <SplashScreen />;
  }

  // If not first time and not signed in, go to sign-in
  return <Redirect href="/(auth)/sign-in" />;
} 