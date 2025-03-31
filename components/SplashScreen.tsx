import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieSplashScreen from "react-native-lottie-splash-screen";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    LottieSplashScreen.hide(); // Hide after splash screen is shown

    setTimeout(() => {
      navigation.replace("Home"); // Navigate to Home after animation
    }, 3000);
  }, []);

  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default SplashScreen;
