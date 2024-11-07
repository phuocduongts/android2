import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "cartItems";

const ProductItem = ({ item }) => {
  const navigation = useNavigation();

  const handleProductPress = () => {
    navigation.navigate("productdetail", { productId: item.id });
  };

  const handleAddToCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_KEY);
      const cartData = storedCart ? JSON.parse(storedCart) : [];

      const existingItem = cartData.find((cartItem) => cartItem.productId === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartData.push({ productId: item.id, quantity: 1 });
      }

      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartData));
      Alert.alert("Thông báo", `${item.title} đã được thêm vào giỏ hàng!`);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  return (
    <View style={styles.productItem}>
      <TouchableOpacity onPress={handleProductPress}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
      </TouchableOpacity>
      <Text style={styles.productName} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.discountedPrice}>đ{item.price.toFixed(2)}</Text>
      </View>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productItem: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  productPrice: {
    color: "#ff751a",
    fontWeight: "bold",
  },
});

export default ProductItem;
