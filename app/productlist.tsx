import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const products = [
  {
    id: "1",
    name: "Product 1",
    image: require("../assets/images/product1.webp"),
    originalPrice: 100000,
    discountedPrice: 80000,
    soldCount: 150,
  },
  {
    id: "2",
    name: "Product 2",
    image: require("../assets/images/product2.webp"),
    originalPrice: 150000,
    discountedPrice: 120000,
    soldCount: 200,
  },
  {
    id: "3",
    name: "Product 1",
    image: require("../assets/images/product1.webp"),
    originalPrice: 100000,
    discountedPrice: 80000,
    soldCount: 150,
  },
  {
    id: "4",
    name: "Product 2",
    image: require("../assets/images/product2.webp"),
    originalPrice: 150000,
    discountedPrice: 120000,
    soldCount: 200,
  },
  {
    id: "5",
    name: "Product 1",
    image: require("../assets/images/product1.webp"),
    originalPrice: 100000,
    discountedPrice: 80000,
    soldCount: 150,
  },
  {
    id: "5",
    name: "Product 2",
    image: require("../assets/images/product2.webp"),
    originalPrice: 150000,
    discountedPrice: 120000,
    soldCount: 200,
  },
  // Add more products as needed
];


const ProductItem = ({ item }) => {
  const navigation = useNavigation();

  const handleProductPress = () => {
    navigation.navigate("productdetail", { product: item });
  };
  const handleAddToCart = () => {
    Alert.alert("Thông báo", `${item.name} đã được thêm vào giỏ hàng!`);
  };
  return (
    <View style={styles.productItem}>
      <TouchableOpacity onPress={handleProductPress}>
        <Image source={item.image} style={styles.productImage} />
      </TouchableOpacity>
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
      <View style={styles.priceContainer}>
        <Text style={styles.discountedPrice}>
          {item.discountedPrice.toLocaleString()} đ
        </Text>
        <Text style={styles.originalPrice}>
          {item.originalPrice.toLocaleString()} đ
        </Text>
      </View>
      <Text style={styles.soldCount}>Đã bán {item.soldCount}</Text>
      <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
        <Feather name="shopping-cart" size={18} color="white" />
        <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProductList = () => {
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductItem item={item} />}
      keyExtractor={(item) => item.id}
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
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
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
    color: "#FF4500",
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 12,
    color: "#888",
    textDecorationLine: "line-through",
  },
  soldCount: {
    fontSize: 12,
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
});

export default ProductList;
