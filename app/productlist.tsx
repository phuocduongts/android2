import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
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

      // Check if item already exists in cart
      const existingItem = cartData.find(cartItem => cartItem.productId === item.id);
      if (existingItem) {
        existingItem.quantity += 1; // Increase quantity if item exists
      } else {
        cartData.push({ productId: item.id, quantity: 1 }); // Add new item with quantity 1
      }

      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartData));
      Alert.alert("Thông báo", `${item.title} đã được thêm vào giỏ hàng!`);
    } catch (error) {
      console.error("Error adding to cart", error);
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
        <Text style={styles.discountedPrice}>
          đ{item.price.toFixed(2)}
        </Text>
      </View>
      <Text style={styles.category}>{item.category}</Text>
    </View>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF4500" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductItem item={item} />}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.productList}
    />
  );
};

const styles = StyleSheet.create({
  productList: {
    padding: 10,
  },
  productItem: {
    width: (width - 30) / 2,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff751a",
    marginRight: 5,
  },
  category: {
    fontSize: 10,
    color: "#888",
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: "#FF4500",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 5,
  },
  addToCartText: {
    color: "white",
    marginLeft: 5,
    fontSize: 12,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProductList;
