import CustomButton from '@/components/CustomButton';
import { onboarding } from '@/constants';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  const isFirstSlide = activeIndex === 0;

  return (
    <SafeAreaView className="flex h-full items-center justify-between bg-white">
      {/* Skip Button */}
      <TouchableOpacity
        onPress={() => {
          router.replace('/(auth)/sign-up');
        }}
        style={{ padding: moderateScale(16), alignSelf: 'flex-end' }}
      >
        <Text style={{ color: '#2D6936', fontSize: moderateScale(12), fontWeight: 'bold' }}>
          Skip
        </Text>
      </TouchableOpacity>

      {/* Swiper Container */}
      <View style={{ flex: 1, width: '100%', position: 'relative' }}>
        <Swiper
          ref={swiperRef}
          loop={false}
          dot={
            <View
              style={{
                width: scale(32),
                height: verticalScale(4),
                marginHorizontal: scale(4),
                backgroundColor: '#E2E8F0',
                borderRadius: moderateScale(50),
              }}
            />
          }
          activeDot={
            <View
              style={{
                width: scale(32),
                height: verticalScale(4),
                marginHorizontal: scale(4),
                backgroundColor: '#47734D',
                borderRadius: moderateScale(50),
              }}
            />
          }
          onIndexChanged={(index) => setActiveIndex(index)}
        >
          {onboarding.map((item) => (
            <View key={item.id} style={{ alignItems: 'center', justifyContent: 'center', padding: moderateScale(20) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: verticalScale(20) }}>
                <Text style={{ color: 'black', fontSize: moderateScale(24), fontWeight: 'bold', textAlign: 'center', marginHorizontal: scale(10) }}>
                  {item.title}
                </Text>
              </View>
              <Text style={{ fontSize: moderateScale(16), fontWeight: '600', textAlign: 'center', color: '#858585', marginHorizontal: scale(10), marginTop: verticalScale(8) }}>
                {item.description}
              </Text>
            </View>
          ))}
        </Swiper>

        {/* Custom Button Positioned Above the Dots */}
        <View 
        
        style={{ 
          position: 'absolute', 
          bottom: verticalScale(58), 
          // left: scale(20), 
          right: scale(8), 
          alignItems: 'center' 
        }}
        
        
        >
          <CustomButton
            title={isFirstSlide ? 'Get Started' : isLastSlide ? 'Create Account' : 'Continue'}
            onPress={() =>
              isLastSlide ? router.replace('/(auth)/sign-up') : swiperRef.current?.scrollBy(1)
            }
            style={{ width: '80%' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
