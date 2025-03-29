import { Stack } from "expo-router";


const Layout = () => {
  return (
  
   <Stack initialRouteName="welcome" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="welcome" options={{ headerShown: false }}/>
    <Stack.Screen name="sign-up" options={{ headerShown: false }}/>
    <Stack.Screen name="sign-in" options={{ headerShown: false }}/>
   </Stack>
   
  );
}

export default Layout