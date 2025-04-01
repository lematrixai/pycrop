import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, SafeAreaView, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

import CustomButton from "@/components/CustomButton";
import { icons, images } from "@/constants";
import { fetchAPI } from "@/lib/fetch";
import InputField from "@/components/InputField";
import OAuth from "@/components/Outh";
import OTPInput from "@/components/OTPInput";

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const onPressVerify = async () => {
    if (!isLoaded) return;
    setIsVerifying(true);
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-white">  
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white justify-center h-screen">
          <Image source={images.tomato} style={styles.tomatoImage} className="relative" />
          <Text style={styles.headerText}  >
             Register 
        </Text>
        <Text style={styles.subheaderText} >
            Create your new account
        </Text>
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
            title={isLoading ? "Signing up..." : "Sign Up"}
            onPress={onSignUpPress}
            style={styles.signUpButton}
            disabled={isLoading}
            IconRight={() => isLoading ? <ActivityIndicator color="#fff" /> : null}
          />
          <OAuth />
          <Text style={styles.loginText} className="text-center text-general-200">
            Already have an account?{" "}
            <Link href="/sign-in" style={styles.signInText}>Log In</Link>
          </Text>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle} className="font-JakartaExtraBold">
              Verification
            </Text>
            <Text style={styles.modalSubtitle} className="font-Jakarta">
              We've sent a verification code to {form.email}.
            </Text>
            <OTPInput
              length={5}
              value={verification.code}
              onChange={(code) => setVerification({ ...verification, code })}
              error={verification.error}
            />
            <CustomButton
              title={isVerifying ? "Verifying..." : "Verify Email"}
              onPress={onPressVerify}
              style={styles.verifyButton}
              disabled={isVerifying}
              className="bg-success-500"
              IconRight={() => isVerifying ? <ActivityIndicator color="#fff" /> : null}
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View style={styles.modalContainer}>
            <Image
              source={images.check}
              style={styles.successImage}
              className="mx-auto"
            />
            <Text style={styles.successTitle} className="font-JakartaBold text-center">
              Verified
            </Text>
            <Text style={styles.successSubtitle} className="text-gray-400 font-Jakarta text-center">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => router.push(`/(tabs)/home`)}
              style={styles.homeButton}
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  headerText: {
    fontSize: moderateScale(24),
    left: scale(20),
    color: '#2D6936',
    fontFamily: 'Jakarta-Bold',
    marginBottom: verticalScale(10),
  },
  subheaderText: {
    fontSize: moderateScale(14),
    color: '#858585',
    fontFamily: 'Jakarta-Regular',
    marginBottom: verticalScale(10),
    left: scale(20),

  },
  tomatoImage: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    position: 'absolute' as const,
    top: 0,
    right: 0,
    marginTop: verticalScale(20),
    marginRight: scale(20),
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
  modalContainer: {
    backgroundColor: 'white',
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(36),
    borderRadius: scale(16),
    minHeight: verticalScale(300),
  },
  modalTitle: {
    fontSize: moderateScale(24),
    marginBottom: verticalScale(8),
  },
  modalSubtitle: {
    marginBottom: verticalScale(20),
  },
  errorText: {
    marginTop: verticalScale(4),
  },
  verifyButton: {
    marginTop: verticalScale(20),
  },
  signInText: {
    color: '#2D6936',
  },
  successImage: {
    width: scale(110),
    height: scale(110),
    marginVertical: verticalScale(20),
  },
  successTitle: {
    fontSize: moderateScale(30),
  },
  successSubtitle: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(8),
  },
  homeButton: {
    marginTop: verticalScale(20),
  },
};

export default SignUp;