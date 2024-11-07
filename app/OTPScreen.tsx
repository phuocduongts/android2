import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function OTPScreen() {
  const route = useRoute();
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigation = useNavigation();

  useEffect(() => {
    Alert.alert(
      "Thông báo",
      `Mã OTP đã được gửi đến số điện thoại: ${phoneNumber}`
    );
  }, [phoneNumber]);

  const handleVerifyOtp = () => {
    const fakeOtp = "4187"; // Simulated OTP for testing
    const enteredOtp = otp.join(""); // Join the array into a single string

    if (enteredOtp === fakeOtp) {
      Alert.alert("Success", "Xác minh OTP thành công!");
      navigation.navigate("checkout", { items: [], phoneNumber }); // Pass actual items if needed
    } else {
      Alert.alert("Error", "Mã OTP không đúng!");
    }
  };

  const handleResendOtp = () => {
    setOtp(["", "", "", ""]);
    Alert.alert(
      "Thông báo",
      `Mã OTP đã được gửi lại đến số điện thoại: ${phoneNumber}`
    );
  };

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.replace(/[^0-9]/g, ""); // Only allow numbers
    setOtp(newOtp);

    // Move to the next input
    if (text && index < 3) {
      const nextInput = index + 1;
      // Reference the next input and focus it
      setTimeout(() => {
        if (nextInput < 4) {
          this[`otpInput${nextInput}`].focus();
        }
      }, 50);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Nhập mã OTP</Text>
        <Text style={styles.instructions}>
          Mã OTP đã được gửi đến số {phoneNumber}
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(input) => { this[`otpInput${index}`] = input; }}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              maxLength={1} // Limit input to 1 character
              keyboardType="numeric"
              textAlign="center"
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleResendOtp} style={styles.resendButton}>
          <Text style={styles.resendText}>Gửi lại mã OTP?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
          <Text style={styles.verifyButtonText}>Xác minh OTP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  otpInput: {
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    width: "20%", // Adjust width to fit four inputs
    backgroundColor: "#fff",
    textAlign: "center",
    fontSize: 24,
  },
  verifyButton: {
    backgroundColor: "#ffb6c1",
    borderRadius: 6,
    paddingVertical: 15,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendButton: {
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  resendText: {
    color: "#ffb6c1",
    fontSize: 16,
    fontWeight: "bold",
  },
});
