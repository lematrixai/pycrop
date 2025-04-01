import { useSignIn } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View, StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from 'react-native-size-matters';
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import InputField from "@/components/InputField";
import OAuth from "@/components/Outh";
import LottieView from "lottie-react-native";

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)/home");
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling for more info on error handling
        console.log(JSON.stringify(signInAttempt, null, 2));
        Alert.alert("Error", "Log in failed. Please try again.");
      }
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  }, [isLoaded, form]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <LottieView
            source={require('../../assets/animations/signInAnnie.json')}
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
          <Text style={styles.welcomeText}>
            Welcome 👋 
          </Text>
        </View>

        <View style={styles.formContainer}>
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
            title="Sign In"
            onPress={onSignInPress}
            style={styles.signInButton}
          />

          <OAuth />

          <Text style={styles.signUpLink}>
            Don't have an account?{" "}
            <Link href="/sign-up" style={styles.signUpText}>Sign Up</Link>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: scale(280),
  },
  welcomeText: {
    fontSize: moderateScale(24),
    color: '#000',
    fontFamily: 'Jakarta-Bold',
    marginLeft: scale(15),
    marginTop: verticalScale(10),
  },
  formContainer: {
    padding: moderateScale(20),
  },
  signInButton: {
    marginTop: verticalScale(20),
  },
  signUpLink: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: '#858585',
    marginTop: verticalScale(20),
  },
  signUpText: {
    color: '#2D6936',
  },
  lottieAnimation: {
    height: verticalScale(200),
    width: '100%',
    alignSelf: 'flex-start',
    marginTop: verticalScale(-38),
  },
});

export default SignIn;