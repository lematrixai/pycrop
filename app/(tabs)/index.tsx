import { useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router'
import React from 'react'

const Home = () => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <Redirect href="/(auth)/welcome" />
  )
}

export default Home
