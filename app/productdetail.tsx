import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Header from "./header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch product details");
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity((prevQuantity) => prevQuantity + 1);
  const decreaseQuantity = () => setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));

  const handleAddToCart = () => {
    Alert.alert("Thông báo", "Sản phẩm đã được thêm vào giỏ hàng thành công!");
  };

  const handleBuyNow = () => {
    navigation.navigate("checkout", { product, quantity });
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

  if (!product) {
    return null;
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
              <View style={styles.priceWrapper}>
                <Text style={styles.price}>
                  ${product.price.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.category}>{product.category}</Text>
            </View>

            <Text style={styles.sectionTitle}>Số lượng:</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Mô tả sản phẩm:</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
                <Text style={styles.cartButtonText}>Thêm vào giỏ hàng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
                <Text style={styles.buyButtonText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  category: {
    fontSize: 12,
    color: "#888",
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
    height: "50%",
  },
  infoContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 20,
    marginBottom: 10,
  },
  priceWrapper: {
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 15,
    color: "orange",
  },
  strikethrough: {
    textDecorationLine: "line-through",
    marginRight: 10,
  },
  salePrice: {
    fontSize: 15,
    color: "#FF6600",
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 6,
  },
  sizeContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginRight: 10,
  },
  selectedSizeButton: {
    borderColor: "#FF6600",
  },
  sizeButtonText: {
    fontSize: 10,
  },
  selectedSizeButtonText: {
    color: "#FF6600",
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
  },
  quantityText: {
    fontSize: 15,
    marginHorizontal: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 10,
  },
  relatedProductItem: {
    marginRight: 15,
    width: 100,
  },
  relatedProductImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 5,
  },
  relatedProductName: {
    fontSize: 15,
    marginTop: 5,
  },
  relatedProductPrice: {
    fontSize: 14,
    color: "#888",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cartButton: {
    backgroundColor: "#FFCC99", // Light orange color for the cart button
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 10,
    borderWidth: 2, // Border thickness
    borderColor: "#FF6600", // Border color
  },

  cartButtonText: {
    color: "#FF6600",
    fontSize: 15,
  },
  buyButton: {
    backgroundColor: "#FF6600",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  buyButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between", // Add this line
  },
  priceWrapper: {
    flexDirection: "row",
    alignItems: "center",
  }, // Add this new style
  soldCount: {
    fontSize: 12,
    color: "#888",
  }, // Add this new style
});

export default ProductDetail;
