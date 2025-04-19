import React, { useCallback } from 'react';
import { Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function Home() {
  const { isSignedIn, sessionId, isLoaded, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      router.replace('/(auth)/sign-in')
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  }, [signOut, router]);

  const showLogoutAlert = useCallback(() => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: handleLogout,
        style: "destructive",
      },
    ]);
  }, [handleLogout]); 


  return (
    isSignedIn && sessionId && (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <TouchableOpacity style={styles.button} onPress={showLogoutAlert}>
          <Text style={styles.text}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    ) 
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: 'black',
    marginBottom: 20,
    fontSize: 24,
    fontFamily: 'Jakarta-Bold',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    backgroundColor: 'red',
    width: '100%',
  },
  text: {
    fontFamily: 'Jakarta-Bold',
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});


