import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Header from "./header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window");
const CART_KEY = "cartItems";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/${productId}`
      );
      const data = await response.json();
      setProduct(data);
      await fetchRelatedProducts(data.category); // Fetch related products
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch product details");
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      const data = await response.json();
      setRelatedProducts(data.filter((item) => item.id !== productId)); // Exclude the current product
    } catch (err) {
      console.error("Failed to fetch related products", err);
    }
  };

  const increaseQuantity = () =>
    setQuantity((prevQuantity) => prevQuantity + 1);
  const decreaseQuantity = () =>
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));

  const handleAddToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem(CART_KEY);
      const cartItems = existingCart ? JSON.parse(existingCart) : [];
      const existingItemIndex = cartItems.findIndex(
        (item) => item.productId === product.id
      );
      if (existingItemIndex > -1) {
        cartItems[existingItemIndex].quantity += quantity;
      } else {
        cartItems.push({ productId: product.id, quantity });
      }
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(cartItems));
      setIsAddedToCart(true);
      Toast.show({
        text1: "Sản phẩm đã được thêm vào giỏ hàng!",
        type: "success",
        position: "bottom",
        visibilityTime: 3000,
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleBuyNow = () => {
    navigation.navigate("checkout", { items: [{ product, quantity }] });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header navigation={navigation} />
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: product.image }}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{product.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>đ{product.price.toFixed(2)}</Text>
              <Text style={styles.category}>{product.category}</Text>
            </View>

            <Text style={styles.sectionTitle}>Số lượng:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                onPress={increaseQuantity}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Mô tả sản phẩm:</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Text style={styles.sectionTitle}>Sản phẩm liên quan:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {relatedProducts.map((relatedProduct) => (
                <TouchableOpacity
                  key={relatedProduct.id}
                  style={styles.relatedProductContainer}
                  onPress={() =>
                    navigation.navigate("productdetail", {
                      productId: relatedProduct.id,
                    })
                  }
                >
                  <Image
                    source={{ uri: relatedProduct.image }}
                    style={styles.relatedProductImage}
                  />
                  <Text style={styles.relatedProductName}>
                    {relatedProduct.title}
                  </Text>
                  <Text style={styles.relatedProductPrice}>
                    đ{relatedProduct.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={handleAddToCart}
              >
                <Text style={styles.cartButtonText}>
                  {isAddedToCart ? "Đã thêm vào giỏ hàng" : "Thêm vào giỏ hàng"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 250,
    width: width,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    width: width * 0.3,
    height: "150%",
  },
  infoContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 15,
    marginBottom: 10,
    fontWeight: "bold",

  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    color: "#ff751a",
  },
  sectionTitle: {
    fontSize: 15,
    marginTop: 15,
    marginBottom: 6,
    fontWeight: "bold",

  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    
  },
  quantityButton: {
    width: 23,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
    
  },
  quantityButtonText: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",

  },
  quantityText: {
    fontSize: 15,
    marginHorizontal: 10,
    fontWeight: "bold",

  },
  description: {
    fontSize: 13,
    lineHeight: 24,
    marginBottom: 10,
    
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cartButton: {
    backgroundColor: "#ffe0cc",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#ff751a",
  },
  cartButtonText: {
    color: "#ff751a",
    fontSize: 15,
  },
  buyButton: {
    backgroundColor: "#ff751a",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  relatedProductContainer: {
    marginRight: 10,
    width: width * 0.4,
    alignItems: "center",
  },
  relatedProductImage: {
    width: "50%",
    height: 100,
    borderRadius: 10,
  },
  relatedProductName: {
    fontSize: 12,
    textAlign: "center",
    marginVertical: 5,
    fontWeight: "bold",

  },
  relatedProductPrice: {
    fontSize: 14,
    color: "#ff751a",
  },
});

export default ProductDetail;
