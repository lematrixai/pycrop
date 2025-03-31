import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { scale, verticalScale } from 'react-native-size-matters';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function AnimatedSplashScreen() {
  const [isLottieReady, setIsLottieReady] = useState(false);

  useEffect(() => {
    // Hide splash screen after animation is ready
    if (isLottieReady) {
      const timer = setTimeout(() => {
        SplashScreen.hideAsync();
        router.replace('/(auth)/welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isLottieReady]);

  return (
    <View style={{ flex: 1, backgroundColor: '#447055', justifyContent: 'center', alignItems: 'center' }}>
      <LottieView
        source={require('../assets/animations/splash.json')}
        autoPlay
        loop={false}
        style={{ width: scale(200), height: scale(200) }}
        onAnimationFinish={() => setIsLottieReady(true)}
      />
      {!isLottieReady && (
        <Text style={{ color: 'white', marginTop: verticalScale(20) }}>Loading...</Text>
      )}
    </View>
  );
} 