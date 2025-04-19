import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import InputField from "@/components/InputField";
import OAuth from "@/components/Outh";
import OTPInput from "@/components/OTPInput";

import LottieView from "lottie-react-native";

type VerificationState = 'idle' | 'pending' | 'verifying' | 'success' | 'error';

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  
  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Verification state
  const [verificationState, setVerificationState] = useState<VerificationState>('idle');
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Loading states
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSignUp = async () => {
    if (!isLoaded) return;

    if (!form.email.trim() || !form.password.trim()) {
      Alert.alert("Sign Up", "Please fill in all required fields");
      return;
    }

    setIsSigningUp(true);
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerificationState('pending');
    } catch (err: any) {
      if (err.errors?.[0]?.code === "session_exists") {
        Alert.alert(
          "⚠️ Session Exists",
          "You're already signed in. Please sign out first to create a new account.",
          [{ text: "OK", onPress: () => router.replace("/sign-in") }]
        );
      } else {
        Alert.alert("Sign Up", err.errors[0].longMessage);
      }
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleVerification = async () => {
    if (!isLoaded) return;
    
    setVerificationState('verifying');
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      
      if (completeSignUp.status === "complete") {
        setVerificationState('success');
        
        await Promise.all([
          fetchAPI("/(api)/user", {
            method: "POST",
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              clerkId: completeSignUp.createdUserId,
            }),
          }),
          setActive({ session: completeSignUp.createdSessionId })
        ]);
      } else {
        setVerificationState('error');
        setErrorMessage("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setVerificationState('error');
      setErrorMessage(err.errors[0].longMessage);
    }
  };

  const resetVerification = () => {
    setVerificationState('idle');
    setVerificationCode("");
    setErrorMessage("");
  };

  const handleNavigateToHome = () => {
    resetVerification();
    router.replace("/(tabs)/home");
  };

  return (
      <ScrollView className="flex-1 bg-white">
        <View className="flex-1 bg-white justify-center h-screen">
          <View style={styles.headerContainer}>
            <Image source={images.tomato} style={styles.tomatoImage} className="relative" />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerText}>Register</Text>
              <Text style={styles.subheaderText}>Create your new account</Text>
            </View>
          </View>
          
          <View style={styles.formContainer}>
            <InputField
              label="Name"
              placeholder="Enter name"
              icon={icons.person}
              value={form.name}
              onChangeText={(value) => setForm({ ...form, name: value })}
            />
            <InputField
              label="Email"
              placeholder="Enter email"
              icon={icons.email}
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <InputField
              label="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => setForm({ ...form, password: value })}
            />
            
            <CustomButton
              title={isSigningUp ? "Signing up..." : "Sign Up"}
              onPress={handleSignUp}
              style={styles.signUpButton}
              disabled={isSigningUp}
              className="bg-success-500"
              IconRight={() => isSigningUp ? <ActivityIndicator color="#fff" /> : null}
            />
            
            <OAuth />
            
            <Text style={styles.loginText} className="text-center text-general-200">
              Already have an account?{" "}
              <Link href="/sign-in" style={styles.signInText}>Log In</Link>
            </Text>
          </View>

          {/* Verification Modal */}
          <ReactNativeModal
            isVisible={verificationState === 'pending' || verificationState === 'error'}
            onModalHide={resetVerification}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            animationInTiming={300}
            animationOutTiming={300}
          >
            <View style={styles.modalContainer}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={resetVerification}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
              
              <Text style={styles.modalTitle} className="font-JakartaExtraBold">
                Verification
              </Text>
              <Text style={styles.modalSubtitle} className="font-Jakarta">
                We've sent a verification code to {form.email}.
              </Text>
              
              <OTPInput
                length={6}
                value={verificationCode}
                onChange={(code) => {
                  setVerificationCode(code);
                  setErrorMessage("");
                }}
                error={errorMessage}
              />
              
              <CustomButton
                title={verificationState === 'verifying' ? "Verifying..." : "Verify Email"}
                onPress={handleVerification}
                style={styles.verifyButton}
                disabled={verificationState === 'verifying'}
                className="bg-success-500"
                IconRight={() => verificationState === 'verifying' ? <ActivityIndicator color="#fff" /> : null}
              />
            </View>
          </ReactNativeModal>

          {/* Success Modal */}
          <ReactNativeModal 
            isVisible={verificationState === 'success'}
            onModalHide={handleNavigateToHome}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            backdropOpacity={0.5}
            avoidKeyboard
            animationInTiming={300}
            animationOutTiming={300}
          >
            <View style={styles.modalContainerSuccess}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={handleNavigateToHome}
              >
              </TouchableOpacity>
              
              <LottieView
                source={require('../../assets/animations/success.json')}
                autoPlay
                loop={false}
                style={styles.successImage}
                speed={2}
              />
            
              <Text style={styles.modalSubtitle2} className="text-center">
                Your account has been verified successfully.
              </Text>
              
              <CustomButton
                title="Browse Home"
                onPress={handleNavigateToHome}
                style={styles.verifyButton}
                className="bg-success-500  "
              />
            </View>
          </ReactNativeModal>
        </View>
      </ScrollView>
  );
};

const styles = {
  headerContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: scale(20),
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: moderateScale(28),
    color: '#2D6936',
    fontFamily: 'Jakarta-Bold',
    marginBottom: verticalScale(4),
  },
  subheaderText: {
    fontSize: moderateScale(16),
    color: '#858585',
    fontFamily: 'Jakarta-Regular',
  },
  tomatoImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    marginRight: scale(15),
  },
  formContainer: {
    padding: scale(20),
  },
  signUpButton: {
    marginTop: verticalScale(24),
  },
  loginText: {
    fontSize: moderateScale(14),
    marginTop: verticalScale(20),
    color: '#858585',
  },
  modalContainerSuccess: {
    backgroundColor: 'white',
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(4),
    borderRadius: scale(16),
    height: scale(150),
    width: scale(240),
    alignSelf: 'center' as const,
    alignItems: 'center' as const,
  },
  modalTitle2: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(2),
    color: '#2D6936',
  },
  modalSubtitle2: {
    marginBottom: verticalScale(2),
    color: '#858585',
  },
   closeButtonText2: {
    fontSize: moderateScale(20),
    color: '#858585',
    fontFamily: 'Jakarta-Regular',
  },
  loadingIndicator: {
    marginTop: verticalScale(20),
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(36),
    borderRadius: scale(16),
    minHeight: verticalScale(300),
    alignItems: 'center' as const,
  },
  modalTitle: {
    fontSize: moderateScale(24),
    marginBottom: verticalScale(8),
    color: '#2D6936',
  },
  modalSubtitle: {
    marginBottom: verticalScale(20),
    color: '#858585',
  },
  verifyButton: {
    marginTop: verticalScale(10),
  },
  signInText: {
    color: '#2D6936',
    fontFamily: 'Jakarta-Bold',
  },
  successImage: {
    alignSelf: 'center' as const,
    width: scale(60),
    height: scale(60),
  },
  closeButton: {
    position: 'absolute' as const,
    top: scale(10),
    right: scale(10),
    width: scale(30),
    height: scale(30),
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  closeButtonText: {
    fontSize: moderateScale(20),
    color: '#858585',
    fontFamily: 'Jakarta-Regular',
  },
};

export default SignUp;