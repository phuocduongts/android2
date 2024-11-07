import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import ProductItem from "./ProductItem"; // Ensure you import ProductItem or your desired display component

const ProductCategoryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/category/${category.toLowerCase()}`);
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải sản phẩm.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
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
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductItem item={item} />} // Render each product using ProductItem
      numColumns={2}
      contentContainerStyle={styles.productList}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  productList: {
    padding: 10,
  },
});

export default ProductCategoryScreen;
