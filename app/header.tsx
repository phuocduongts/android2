import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = () => {
  const navigation = useNavigation();
  const [cartCount, setCartCount] = useState(0);
  const [username, setUsername] = useState(""); // Lưu tên đăng nhập của người dùng
  const [categories, setCategories] = useState([]); // Lưu các danh mục sản phẩm
  const [filteredCategories, setFilteredCategories] = useState([]); // Lưu các danh mục đã lọc
  const [searchQuery, setSearchQuery] = useState(""); // Trường để theo dõi văn bản tìm kiếm
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const existingCart = await AsyncStorage.getItem("cartItems");
        const cartItems = existingCart ? JSON.parse(existingCart) : [];
        const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);
        setCartCount(count);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products/categories");
        const data = await response.json();
        const transformedData = data.map((category) => ({
          name: category.charAt(0).toUpperCase() + category.slice(1),
        }));
        setCategories(transformedData);
        setFilteredCategories(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setLoading(false);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("user");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUsername(userData.username); // Lấy tên người dùng từ AsyncStorage
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchCartCount();
    fetchCategories(); // Fetch categories khi component load
    fetchUserProfile(); // Lấy thông tin người dùng khi load component
  }, []);

  const handleLogoPress = () => {
    navigation.navigate("home");
  };

  const handleCartPress = () => {
    navigation.navigate("cart");
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);

    // Lọc danh mục theo từ khóa tìm kiếm
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCategories(filtered);
  };

  const handleCategoryPress = (category) => {
    navigation.navigate("ProductCategoryScreen", { category });
  };

  const handleLoginPress = () => {
    navigation.navigate("index");
  };

  const handleRegisterPress = () => {
    navigation.navigate("register");
  };

  const handleProfilePress = () => {
    navigation.navigate("ProfileScreen"); // Chuyển hướng đến màn hình Profile khi nhấn vào tên đăng nhập
  };

  const handleLogout = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              // Xóa thông tin người dùng và trạng thái đăng nhập
              await AsyncStorage.removeItem("isLoggedIn");
              setUsername(""); // Xóa tên người dùng khỏi state

              // Điều hướng về trang đăng nhập sau khi đăng xuất
              navigation.reset({
                index: 0,
                routes: [{ name: "index" }],
              });
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Lỗi", "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={handleLogoPress}
        >
          <Image
            source={require("../assets/images/logo.png")}
            style={styles.logo}
          />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm danh mục..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearchChange} // Cập nhật từ khóa tìm kiếm
          />
          <TouchableOpacity style={styles.searchButton}>
            <Feather name="search" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <View style={styles.iconButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={handleCartPress}>
            <Feather name="shopping-cart" size={24} color="black" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Hiển thị danh sách danh mục tìm kiếm */}
      {searchQuery !== "" && (
        <View style={styles.searchResultsContainer}>
          <FlatList
            data={filteredCategories}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(item.name)}
              >
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.name}
          />
          {filteredCategories.length === 0 && (
            <Text style={styles.noResultsText}>Không tìm thấy danh mục</Text>
          )}
        </View>
      )}

      <View style={styles.bottomRow}>
        <View style={styles.authButtons}>
          {username ? (
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={handleProfilePress}>
                <Text style={styles.authButtonText}>{username}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.authButtonText}>ĐĂNG XUẤT</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={handleLoginPress}>
              <Text style={styles.authButtonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 70,
    height: 30,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 20,
    overflow: "hidden",
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  searchButton: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  iconButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 15,
  },
  searchResultsContainer: {
    position: "absolute",
    top: 60,
    left: 10,
    right: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    maxHeight: 200,
    zIndex: 1000,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  categoryText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    padding: 10,
    color: "gray",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  authButtonText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;
