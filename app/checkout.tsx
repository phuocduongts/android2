import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const Checkout = () => {
  const route = useRoute();
  const { items } = route.params;

  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const shippingOptions = [
    { id: "standard", label: "Tiêu chuẩn", price: 30000 },
    { id: "fast", label: "Nhanh", price: 50000 },
  ];

  const paymentMethods = [
    { id: "cod", label: "Thanh toán khi nhận hàng" },
    { id: "bank", label: "Chuyển khoản ngân hàng" },
  ];

  const renderCartItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.product.title}</Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.quantityText}>Quantity: {item.quantity}</Text>
          <Text style={styles.productPrice}>
            ${(item.product.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = shippingOptions.find(
    (option) => option.id === selectedShipping
  ).price;
  const total = subtotal + shippingFee;

  const handleOrder = () => {
    Alert.alert("Thông báo", "Đặt hàng thành công!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
        <TextInput
          placeholder="Tân lập 2, Hiệp Phú, TP.Thủ Đức"
          value={address}
          onChangeText={setAddress}
          multiline
          style={styles.input}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={(item) => item.productId.toString()}
          scrollEnabled={false}
        />
      </View>

      {/* Shipping Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
        {shippingOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.shippingOption,
              selectedShipping === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedShipping(option.id)}
          >
            <Text>
              {option.label} - {option.price.toLocaleString()}đ
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ghi chú</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập ghi chú nếu cần"
          value={note}
          onChangeText={setNote}
          multiline
        />
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentOption,
              selectedPayment === method.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedPayment(method.id)}
          >
            <Text>{method.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Payment Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
        <View style={styles.row}>
          <Text>Tổng tiền hàng</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text>Phí vận chuyển</Text>
          <Text>{(shippingFee / 23000).toFixed(2)}$</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Tổng thanh toán</Text>
          <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Order Button */}
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>Đặt hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: "contain", // Ensure the image fits well
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 14,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6600",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    minHeight: 40,
  },
  productContainer: {
    flexDirection: "row",
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  shippingOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  paymentOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 5,
  },
  selectedOption: {
    borderColor: "#FF6600",
    backgroundColor: "#FFCC99",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
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
  orderButton: {
    backgroundColor: "#FF6600",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    margin: 15,
  },
  orderButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 20,
    height: 20,
    backgroundColor: "#FF6600",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  quantityButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF6600",
  },
});

export default Checkout;