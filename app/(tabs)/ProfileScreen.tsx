import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    avatar: require('../../assets/images/logo.png'), // Placeholder image
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserProfile(prevProfile => ({
          ...prevProfile,
          username: userData.username,
          email: userData.email,
        }));
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          onPress: async () => {
            try {
              // Xóa trạng thái đăng nhập
              await AsyncStorage.removeItem('isLoggedIn'); // Xóa trạng thái đăng nhập

              // Cập nhật lại state để xóa thông tin người dùng trên giao diện
              setUserProfile({
                username: '',
                email: '',
                avatar: require('../../assets/images/logo.png'), // Giữ avatar mặc định
              });

              // Điều hướng về màn hình đăng nhập
              navigation.reset({
                index: 0,
                routes: [{ name: 'index' }],
              });
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const renderMenuItem = (icon, title, onPress) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color="#333" />
      <Text style={styles.menuItemText}>{title}</Text>
      <Ionicons name="chevron-forward" size={24} color="#999" />
    </TouchableOpacity>
  );

  const handleGoHome = () => {
    navigation.navigate('home'); // Navigate to Home screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={userProfile.avatar} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.name}>{userProfile.username || 'Chưa có tên'}</Text>
            <Text style={styles.email}>{userProfile.email || 'Chưa có email'}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {/* Add "Trang chủ" to the menu */}
          {renderMenuItem('home-outline', 'Trang chủ', handleGoHome)}
          {renderMenuItem('person-outline', 'Thông tin cá nhân', () => handleMenuItemPress('Thông tin cá nhân'))}
          {renderMenuItem('cart-outline', 'Đơn hàng của tôi', () => handleMenuItemPress('Đơn hàng của tôi'))}
          {renderMenuItem('settings-outline', 'Cài đặt', () => handleMenuItemPress('Cài đặt'))}
          {renderMenuItem('help-circle-outline', 'Trợ giúp & Hỗ trợ', () => handleMenuItemPress('Trợ giúp & Hỗ trợ'))}
        </View>

        <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 18,
    marginLeft: 20,
    flex: 1,
    color: '#333',
  },
  logoutButtonContainer: {
    margin: 20,
    backgroundColor: '#e91e63',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
