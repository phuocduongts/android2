import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert, // Import Alert for showing notifications
} from "react-native";
import Header from "./header";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProductDetail = ({}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation();

  const product = {
    id: "1",
    name: "Áo thun local brand By UniSpace tay lỡ form rộng unisex oversize nam nữ Teddy Bear",
    price: 310000,
    salePrice: 172000,
    soldCount: 1500,
    image: require("../assets/images/product1.webp"),
    description: "",
    sizes: ["S", "M", "L", "XL"],
  };

  const relatedProducts = [
    {
      id: "2",
      name: "Áo thun",
      price: 349000,
      image: require("../assets/images/product1.webp"),
    },
    {
      id: "3",
      name: "Áo thun",
      price: 399000,
      image: require("../assets/images/product1.webp"),
    },
    {
      id: "4",
      name: "Áo thun",
      price: 599000,
      image: require("../assets/images/product1.webp"),
    },
  ];

  const renderRelatedProduct = ({ item }) => (
    <View style={styles.relatedProductItem}>
      <Image source={item.image} style={styles.relatedProductImage} />
      <Text style={styles.relatedProductName}>{item.name}</Text>
      <Text style={styles.relatedProductPrice}>
        {item.price.toLocaleString("vi-VN")} ₫
      </Text>
    </View>
  );

  const increaseQuantity = () =>
    setQuantity((prevQuantity) => prevQuantity + 1);
  const decreaseQuantity = () =>
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));

  const handleAddToCart = () => {
    // Show an alert when the product is added to the cart
    Alert.alert("Thông báo", "Sản phẩm đã được thêm vào giỏ hàng thành công!");
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      Alert.alert("Thông báo", "Vui lòng chọn kích cỡ trước khi mua hàng.");
      return;
    }

    // Sử dụng replace thay vì navigate
    navigation.navigate("checkout", { product, selectedSize, quantity });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Header navigation={navigation} />
        <ScrollView style={styles.scrollView}>
          <View style={styles.imageContainer}>
            <Image
              source={product.image}
              style={styles.productImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.priceContainer}>
              <View style={styles.priceWrapper}>
                <Text
                  style={[
                    styles.price,
                    product.salePrice && styles.strikethrough,
                  ]}
                >
                  {product.price.toLocaleString("vi-VN")} ₫
                </Text>
                {product.salePrice && (
                  <Text style={styles.salePrice}>
                    {product.salePrice.toLocaleString("vi-VN")} ₫
                  </Text>
                )}
              </View>
              <Text style={styles.soldCount}>Đã bán {product.soldCount}</Text>
            </View>

            <Text style={styles.sectionTitle}>Chọn kích cỡ:</Text>
            <View style={styles.sizeContainer}>
              {product.sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeButton,
                    selectedSize === size && styles.selectedSizeButton,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={[
                      styles.sizeButtonText,
                      selectedSize === size && styles.selectedSizeButtonText,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
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
            <FlatList
              data={relatedProducts}
              renderItem={renderRelatedProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cartButton}
                onPress={handleAddToCart}
              >
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
    width: width * 0.8,
    height: "100%",
  },
  infoContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 15,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 15,
    color: "#888",
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
    fontSize: 15,
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
