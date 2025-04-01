import { View, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const hasSeenSplash = await AsyncStorage.getItem('hasSeenSplash');
        
        if (!hasSeenSplash) {
          // First time user
          setTimeout(async () => {
            await AsyncStorage.setItem('hasSeenSplash', 'true');
            router.replace('/(tabs)/home');
          }, 3000); // Show splash for 3 seconds
        } else {
          // Returning user
          router.replace('/(tabs)/home');
        }
      } catch (error) {
        console.error('Error checking first time:', error);
        router.replace('/(tabs)/home');
      }
    };

    checkFirstTime();
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animations/splash.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#447055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: scale(200),
    height: scale(200),
  },
});

export default SplashScreen;
