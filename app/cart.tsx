import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "./header";

const Cart = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      // Fetch cart data
      const cartResponse = await fetch('https://fakestoreapi.com/carts/1');
      const cartData = await cartResponse.json();

      // Fetch all products
      const productsResponse = await fetch('https://fakestoreapi.com/products');
      const productsData = await productsResponse.json();

      // Create a map of products for easy lookup
      const productsMap = productsData.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {});

      setProducts(productsMap);
      setCartItems(cartData.products.map(item => ({
        ...item,
        selected: true,
        product: productsMap[item.productId]
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateQuantity = (productId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const toggleItemSelection = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <TouchableOpacity
        onPress={() => toggleItemSelection(item.productId)}
        style={styles.checkbox}
      >
        {item.selected ? (
          <Feather name="check-square" size={24} color="#FF6600" />
        ) : (
          <Feather name="square" size={24} color="#888" />
        )}
      </TouchableOpacity>
      <Image source={{ uri: item.product.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.product.title}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.productId, -1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.productId, 1)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.itemPrice}>
        ${(item.product.price * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => (item.selected ? sum + item.product.price * item.quantity : sum),
    0
  );

  const handleCheckout = () => {
    const selectedItems = cartItems.filter(item => item.selected);
    navigation.navigate("checkout", { items: selectedItems });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Cart</Text>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.productId.toString()}
            scrollEnabled={false}
          />
          <View style={styles.summaryContainer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmount}>
                ${totalAmount.toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>Checkout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  title: {
    textAlign: "left",
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: "contain", // Ensure the image fits well
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemInfo: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    width: 23,
    height: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  quantity: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  totalContainer: {
    flex: 1,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF6600",
  },
  checkoutButton: {
    backgroundColor: "#FF6600",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 100,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;