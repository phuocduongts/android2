import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert, // Import Alert component
} from "react-native";

const Checkout = () => {
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("cod");
  const [quantity, setQuantity] = useState(2);

  const product = {
    name: "Áo thun local brand By UniSpace tay lỡ form rộng unisex oversize nam nữ Teddy Bear",
    price: 199000,
    image: require("../assets/images/product1.webp"),
  };

  const shippingOptions = [
    { id: "standard", label: "Tiêu chuẩn", price: 30000 },
    { id: "fast", label: "Nhanh", price: 50000 },
  ];

  const paymentMethods = [
    { id: "cod", label: "Thanh toán khi nhận hàng" },
    { id: "bank", label: "Chuyển khoản ngân hàng" },
  ];

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const subtotal = product.price * quantity;
  const shippingFee = shippingOptions.find(
    (option) => option.id === selectedShipping
  ).price;
  const total = subtotal + shippingFee;

  const handleOrder = () => {
    // Display a success alert when the order button is pressed
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
        />
      </View>

      {/* Product Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>By UniSpace</Text>
        <View style={styles.productContainer}>
          <Image source={product.image} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.priceQuantityContainer}>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange("decrease")}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange("increase")}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.productPrice}>
                {(product.price * quantity).toLocaleString()}đ
              </Text>
            </View>
          </View>
        </View>
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
          <Text>{subtotal.toLocaleString()}đ</Text>
        </View>
        <View style={styles.row}>
          <Text>Phí vận chuyển</Text>
          <Text>{shippingFee.toLocaleString()}đ</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalText}>Tổng thanh toán</Text>
          <Text style={styles.totalAmount}>{total.toLocaleString()}đ</Text>
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
