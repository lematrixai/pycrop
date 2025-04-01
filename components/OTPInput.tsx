import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const OTPInput = ({ length = 6, value, onChange, error }: OTPInputProps) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));

  useEffect(() => {
    // Update local state when value prop changes
    if (value) {
      const newOtp = value.split('').slice(0, length);
      setOtp([...newOtp, ...Array(length - newOtp.length).fill('')]);
    }
  }, [value, length]);

  const handleChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return; // Only allow digits
    
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    const joinedValue = newOtp.join('');
    onChange(joinedValue);

    // Auto-focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {Array(length).fill(0).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              error && styles.inputError
            ]}
            maxLength={1}
            keyboardType="numeric"
            value={otp[index]}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
            contextMenuHidden
          />
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: verticalScale(10),
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(4),
  },
  input: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    textAlign: 'center',
    fontSize: moderateScale(18),
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: moderateScale(14),
    marginTop: verticalScale(4),
  },
});

export default OTPInput; 