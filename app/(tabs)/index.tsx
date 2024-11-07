import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleRegisterPress = () => {
    navigation.navigate('register');
  };

  const handleLoginPress = async () => {
    if (!username || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin đăng nhập!');
      return;
    }

    setIsLoading(true);

    try {
      const storedUserData = await AsyncStorage.getItem('user');
      console.log("Stored user data:", storedUserData);

      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        console.log("Checking credentials for:", username);

        if (userData.username === username && userData.password === password) {
          // Đăng nhập thành công
          if (isChecked) {
            // Lưu trạng thái đăng nhập
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('rememberedUser', JSON.stringify({ username, password }));
          }
          navigation.navigate('home'); // Chuyển hướng về Home
        } else {
          Alert.alert('Lỗi', 'Tên đăng nhập hoặc mật khẩu không chính xác!');
        }
      } else {
        Alert.alert('Lỗi', 'Tài khoản không tồn tại!');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkSavedCredentials = async () => {
      try {
        const rememberedUser = await AsyncStorage.getItem('rememberedUser');
        if (rememberedUser) {
          const { username: savedUsername, password: savedPassword } = JSON.parse(rememberedUser);
          setUsername(savedUsername);
          setPassword(savedPassword);
          setIsChecked(true);
        }
      } catch (error) {
        console.log('Error checking saved credentials:', error);
      }
    };
    checkSavedCredentials();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.heading}>Đăng nhập</Text>

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
          <Text style={styles.label}>Mật khẩu:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showPasswordButton}
          >
            <Text style={styles.showPasswordText}>
              {showPassword ? "Ẩn" : "Hiển thị"}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.options}>
          <Pressable
            style={styles.rememberMe}
            onPress={() => setIsChecked(!isChecked)}
          >
            <View style={[styles.customCheckbox, isChecked && styles.checked]}>
              {isChecked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Nhớ mật khẩu</Text>
          </Pressable>

          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLoginPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Đăng Nhập</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupLinkContainer}
          onPress={handleRegisterPress}
        >
          <Text style={styles.signupLink}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffe0cc",
  },
  loginBox: {
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
  showPasswordButton: {
    position: "absolute",
    right: 15,
    top: "63%",
    transform: [{ translateY: -8 }],
  },
  showPasswordText: {
    color: "#ff751a",
    fontWeight: "600",
  },
  options: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
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
  forgotPassword: {
    color: "#ff751a",
    fontWeight: "600",
  },
  loginButton: {
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
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  signupLinkContainer: {
    marginTop: 15,
  },
  signupLink: {
    color: "#ff751a",
    fontWeight: "600",
    fontSize: 16,
  },
});
