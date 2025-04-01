import { icons } from '@/constants';
import { Tabs } from 'expo-router';
import React from 'react';
import { Image, ImageSourcePropType, Platform, View, Dimensions } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const TabIcon = ({ focused, source }: { focused: boolean, source: ImageSourcePropType }) => (
  <View className={`flex flex-row items-center justify-center rounded-full `}>
    <View className={`w-14 h-14 rounded-full items-center justify-center ${focused ? 'bg-green-600' : ''}`}>
      <Image
        source={source}
        tintColor={focused ? 'white' : '#858585'}
        className="w-8 h-8"
        resizeMode='contain'
      />
    </View>
  </View>
)

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2D6936',
        tabBarInactiveTintColor: '#858585',
        tabBarShowLabel: false,
        tabBarStyle: {
          ...Platform.select({
            ios: {
              position: 'absolute',
            },
            default: {},
          }),
          backgroundColor: 'white',
          paddingBottom: verticalScale(10),
          borderRadius: scale(30),
          marginHorizontal: scale(20),
          overflow: 'hidden',
          marginBottom: verticalScale(20),
          height: verticalScale(85),
          width: width - scale(40),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          position: 'absolute',
          bottom: 0,
          left: scale(20),
          right: scale(20),
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Bot',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.add} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.chat} />
          ),
        }}
      />
    </Tabs>
  );
}
