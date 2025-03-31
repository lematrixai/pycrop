import CustomButton from '@/components/CustomButton';
import { onboarding } from '@/constants';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Text, View, TextStyle, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';

const Onboarding = () => {
  const swiperRef = useRef<Swiper>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLastSlide = activeIndex === onboarding.length - 1;
  const isFirstSlide = activeIndex === 0;

  // Define unique styles per slide with proper typing
  const titleStyle: Record<number, TextStyle> = {
    1: { 
      color: '#2D6936', 
      fontSize: moderateScale(23), 
      fontWeight: 'bold', 
      textAlign: 'left',
      marginLeft: scale(20),
      position: 'absolute',
      top: verticalScale(10),
    },    
    2: { color: '#47734D', fontSize: moderateScale(32), fontWeight: '800', textAlign: 'right' },
    3: { color: '#2D6936', fontSize: moderateScale(30), fontWeight: '700', textAlign: 'center' },
  };

  const descriptionStyle: Record<number, TextStyle> = {
    1: { color: '#858585', fontSize: moderateScale(16), fontWeight: '500', textAlign: 'center' },
    2: { color: '#47734D', fontSize: moderateScale(18), fontWeight: '600', textAlign: 'center' },
    3: { color: '#858585', fontSize: moderateScale(16), fontWeight: '500', textAlign: 'center' },
  };

  // Fallback styles for unmatched item.id
  const defaultTitleStyle: TextStyle = {
    color: '#2D6936',
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    textAlign: 'center',
  };

  const defaultDescriptionStyle: TextStyle = {
    color: '#858585',
    fontSize: moderateScale(16),
    fontWeight: '500',
    textAlign: 'center',
  };

  return (
    <View style={styles.container}>
      
      {/* Swiper Container */}
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          loop={false}
          dot={<View style={styles.dot} />}
          activeDot={<View style={styles.activeDot} />}
          onIndexChanged={(index) => setActiveIndex(index)}
        >
          {onboarding.map((item) => (
            <View key={item.id} style={styles.slide}>
              <Image
                source={item.image}
                style={styles.backgroundImage}
                resizeMode="cover"
              />
              <View style={[
                item.id === 1 ? styles.textContainer1 :
                item.id === 2 ? styles.textContainer2 :
                styles.textContainer3
              ]}>
                <Text
                  style={[
                    titleStyle[item.id] || defaultTitleStyle, // Dynamic with fallback
                    item.id === 1 ? styles.textContainer1 :
                    item.id === 2 ? styles.textContainer2 :
                    styles.textContainer3                  
                  ]}
                >
                  {item.title}
                </Text>
                {item.description && (
                  <Text
                    style={[
                      descriptionStyle[item.id] || defaultDescriptionStyle, // Dynamic with fallback
                      item.id === 1 ? styles.descContainer1 :
                      item.id === 2 ? styles.descContainer2 :
                      styles.descContainer3                    
                    ]}
                  >
                    {item.description}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </Swiper>

        {/* Custom Button */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title={isFirstSlide ? 'Get Started' : isLastSlide ? 'Create Account' : 'Continue'}
            onPress={() =>
              isLastSlide ? router.replace('/(auth)/sign-up') : swiperRef.current?.scrollBy(1)
            }
            style={{ width: moderateScale(0.8 * 300) }} // Dynamic width (80% of a base value)
          />
        </View>
      </View>
    </View>
  );
};

// Static styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
 
  swiperContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  },

  textContainer1: {
    alignItems: 'flex-start',
    position: 'absolute',
    top: verticalScale(40),
    left: scale(5),
    fontSize: moderateScale(55),
    fontFamily: 'Jakarta-ExtraBold',
    fontWeight: 'bold',
    color: '#2D6936',
  },
  textContainer2: {
    alignItems: 'flex-start',
    top: verticalScale(50),
    right: scale(6),
    color: '#ffffff',
    textAlign: 'left',
  },
  textContainer3: {
    alignItems: 'flex-start',
    padding: scale(20),
    top: verticalScale(48),
    fontFamily: 'Jakarta-ExtraBold',
    fontSize: moderateScale(26),
  },

  descContainer1: {
    alignItems: 'flex-start',
    position: 'absolute',
    top: verticalScale(110),
    left: scale(25),
    fontSize: moderateScale(16),
    fontFamily: 'Jakarta-Regular',
    fontWeight: '500',
    color: '#2D6936',
    width: 300,
    textAlign: 'left',
    lineHeight: 24,
  },
  descContainer2: {
   // None
  },
  descContainer3: {
    top: verticalScale(50),
    fontFamily: 'Jakarta-Regular',
    fontSize: moderateScale(14),
    fontWeight: '500',
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#2D6936',
    left: scale(70),
  },
  
  
  dot: {
    width: scale(32),
    height: verticalScale(4),
    marginHorizontal: scale(4),
    backgroundColor: '#E2E8F0',
    borderRadius: moderateScale(50),
  },
  activeDot: {
    width: scale(32),
    height: verticalScale(4),
    marginHorizontal: scale(4),
    backgroundColor: '#47734D',
    borderRadius: moderateScale(50),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: verticalScale(70),
    right: scale(8),
    alignItems: 'center',
  },
});

export default Onboarding;