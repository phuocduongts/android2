import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegisterPress = async () => {
    if (!username || !email || !phone || !password || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);

    const userData = { username, email, phone, password };

    try {
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      Alert.alert("Thành công", "Đăng ký thành công!");
      navigation.navigate("index");
    } catch (error) {
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.registerBox}>
        <Text style={styles.heading}>Đăng ký</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tên đăng nhập:</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <Pressable
          style={styles.rememberMe}
          onPress={() => setIsChecked(!isChecked)}
        >
          <View style={[styles.customCheckbox, isChecked && styles.checked]}>
            {isChecked && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.rememberText}>Nhớ thông tin</Text>
        </Pressable>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && styles.disabledButton]}
          onPress={handleRegisterPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Đăng Ký</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLinkContainer}
          onPress={() => navigation.navigate("index")}
        >
          <Text style={styles.loginLink}>Đã có tài khoản? Đăng Nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe0cc",
  },
  registerBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    width: 350,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    fontSize: 16,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  customCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#ff751a",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checked: {
    backgroundColor: "#ff751a",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
  },
  rememberText: {
    marginLeft: 8,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#ff751a",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#FF4D00",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  loginLinkContainer: {
    marginTop: 15,
  },
  loginLink: {
    color: "#ff751a",
    fontWeight: "600",
    fontSize: 16,
  },
});
