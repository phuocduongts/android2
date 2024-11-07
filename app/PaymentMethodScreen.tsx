import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import QRCode from "react-native-qrcode-svg";

const PaymentMethodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { totalPayment } = route.params;

  const [showQRCode, setShowQRCode] = useState(false);

  const handlePaymentMethodSelect = (method) => {
    if (method === "VNPAY_QR") {
      setShowQRCode(true);
    } else if (method === "Ví Momo") {
      navigation.navigate("OTPScreen", { phoneNumber: "0123456789" });
    } else {
      Alert.alert(`Bạn đã chọn phương thức thanh toán: ${method}`);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức Thanh toán</Text>

      <TouchableOpacity
        style={styles.paymentOptionMomo}
        onPress={() => handlePaymentMethodSelect("Ví Momo")}
      >
        <Image
          source={require("../assets/images/MoMo_Logo.png")}
          style={styles.momoIcon}
        />
        <Text style={styles.paymentText}>Ví Momo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.paymentOptionVnpay}
        onPress={() => handlePaymentMethodSelect("VNPAY_QR")}
      >
        <Icon name="qr-code" size={24} color="white" style={styles.vnpayIcon} />
        <Text style={styles.paymentText}>VNPAY QR</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.checkoutButton}
        onPress={() => Alert.alert(`Thanh toán: đ${totalPayment.toFixed(2)}`)}
      >
        <Text style={styles.checkoutButtonText}>
          Thanh toán: đ{totalPayment.toFixed(2)}
        </Text>
      </TouchableOpacity>

      <Modal visible={showQRCode} transparent={true} animationType="slide">
        <View style={styles.qrModal}>
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Quét mã để thanh toán</Text>
            <QRCode value={`${totalPayment}`} size={300} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRCode(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  paymentOptionMomo: {
    backgroundColor: "#ffb6c1", // Momo red color
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionVnpay: {
    backgroundColor: "#00bfff", // VNPAY green color
    paddingVertical: 15,
    borderRadius: 8,
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  momoIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginLeft: 10, // Add left margin to shift right
  },
  vnpayIcon: {
    marginRight: 10,
    marginLeft: 10, // Add left margin to shift right
  },
  paymentText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  checkoutButton: {
    width: 200,
    backgroundColor: "#FF0000",
    paddingVertical: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    alignSelf: "center", // Center the button horizontally
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  qrModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  qrContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  qrTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF0000",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default PaymentMethodScreen;
