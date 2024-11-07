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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const Checkout = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { items, removeFromCart, selectedItemIds } = route.params;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const shippingOptions = [
    { id: "standard", label: "Tiêu chuẩn", price: 15, time: "3-5 ngày" },
    { id: "fast", label: "Nhanh", price: 30, time: "1-2 ngày" },
  ];

  const paymentMethods = [
    { 
      id: "cod", 
      label: "Thanh toán khi nhận hàng",
      description: "Thanh toán bằng tiền mặt khi nhận được hàng"
    },
    { 
      id: "qr", 
      label: "Thanh toán bằng chuyển khoản",
      description: "Chuyển khoản qua ngân hàng"
    },
  ];

  const renderCartItem = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.product.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.title}
        </Text>
        <View style={styles.priceQuantityContainer}>
          <Text style={styles.price}>đ{item.product.price.toFixed(2)}</Text>
          <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
        </View>
      </View>
    </View>
  );

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Toast.show({
        text1: "Vui lòng nhập họ tên",
        type: "error",
        position: "bottom",
      });
      return false;
    }
    if (!formData.phone.trim()) {
      Toast.show({
        text1: "Vui lòng nhập số điện thoại",
        type: "error",
        position: "bottom",
      });
      return false;
    }
    if (!formData.address.trim()) {
      Toast.show({
        text1: "Vui lòng nhập địa chỉ nhận hàng",
        type: "error",
        position: "bottom",
      });
      return false;
    }
    return true;
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shippingFee = selectedShipping === "fast" ? 30 : 15;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!validateForm()) return;

    if (selectedPayment === "qr") {
      navigation.navigate("PaymentMethodScreen", { 
        totalPayment: total,
        onSuccess: () => {
          removeFromCart(selectedItemIds);
          showSuccessAlert();
        }
      });
    } else {
      showSuccessAlert();
    }
  };

  const showSuccessAlert = () => {
    Alert.alert(
      "Đặt hàng thành công!",
      `Đơn hàng của bạn đã được xác nhận.\n${
        selectedPayment === "cod" 
          ? "Bạn sẽ thanh toán khi nhận hàng." 
          : "Thanh toán của bạn đã được xác nhận."
      }`,
      [
        {
          text: "OK",
          onPress: () => {
            removeFromCart(selectedItemIds);
            navigation.reset({
              index: 0,
              routes: [{ name: "cart" }],
            });
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Thanh toán</Text>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng của bạn ({items.length} sản phẩm)</Text>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.product.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* Customer Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin người nhận</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={formData.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={formData.phone}
            onChangeText={(text) => handleInputChange('phone', text)}
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, styles.addressInput]}
            placeholder="Địa chỉ nhận hàng"
            value={formData.address}
            onChangeText={(text) => handleInputChange('address', text)}
            multiline
          />
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Ghi chú cho đơn hàng (tùy chọn)"
            value={formData.note}
            onChangeText={(text) => handleInputChange('note', text)}
            multiline
          />
        </View>

        {/* Shipping Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
          {shippingOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionBox,
                selectedShipping === option.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedShipping(option.id)}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <Text style={styles.optionLabel}>{option.label}</Text>
                  <Text style={styles.optionPrice}>đ{option.price}</Text>
                </View>
                <Text style={styles.optionTime}>Thời gian: {option.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.optionBox,
                selectedPayment === method.id && styles.optionSelected,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionLabel}>{method.label}</Text>
                <Text style={styles.optionDescription}>{method.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tổng tiền hàng:</Text>
            <Text style={styles.summaryValue}>đ{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
            <Text style={styles.summaryValue}>đ{shippingFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalValue}>đ{total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.checkoutButton} 
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Đặt hàng (đ{total.toFixed(2)})
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    backgroundColor: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  priceQuantityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    color: "#ff751a",
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  addressInput: {
    height: 80,
    textAlignVertical: "top",
  },
  noteInput: {
    height: 60,
    textAlignVertical: "top",
  },
  optionBox: {
    borderWidth: 1,
    borderColor: "#ff751a",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
  },
  optionSelected: {
    borderColor: "#ff751a",
    backgroundColor: "#ffebcc",
  },
  optionContent: {
    padding: 15,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  optionPrice: {
    fontSize: 16,
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  optionTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  summaryContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
  },
  checkoutButton: {
    backgroundColor: "#ff751a",
    margin: 20,
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Checkout;