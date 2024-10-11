import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ChevronDown } from "lucide-react-native";

const { width } = Dimensions.get("window");

const Footer = () => {
  const [byUnispaceExpanded, setByUnispaceExpanded] = useState(false);
  const [contactExpanded, setContactExpanded] = useState(false);
  const [policyExpanded, setPolicyExpanded] = useState(false);

  return (
    <View style={styles.container}>
      {/* Collapsible sections */}
      <View style={styles.dropdownSection}>
        {/* BY UNISPACE */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setByUnispaceExpanded(!byUnispaceExpanded)}
        >
          <Text style={styles.dropdownButtonText}>BY UNISPACE</Text>
          <ChevronDown size={24} color="#000" />
        </TouchableOpacity>
        {byUnispaceExpanded && (
          <View style={styles.dropdownContent}>
            <Text>Store 1: 109/44/2D Đường Dương Bá Trạc, P1, Q8, HCM.</Text>
            <Text>Store 2: 2A Đường D4, P. Tân Hưng, Q7, TPHCM.</Text>
          </View>
        )}

        {/* CONTACT */}
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setContactExpanded(!contactExpanded)}
        >
          <Text style={styles.dropdownButtonText}>CONTACT</Text>
          <ChevronDown size={24} color="#000" />
        </TouchableOpacity>
        {contactExpanded && (
          <View style={styles.dropdownContent}>
            <Text>Hộ kinh doanh By UniSpace</Text>
            <Text>Ngày cấp: 18/5/2022</Text>
            <Text>Tuyển dụng: tuyendung.unispace@gmail.com</Text>
            <Text>
              CSKH: 028 2227 9888 (T2-T7 - 8h30-21h30) - (CN - 10h-15h)
            </Text>
            <Text>Zalo: 0846081771 - 0833206879</Text>
          </View>
        )}
      </View>

      {/* Logo and Policy section */}
      <View style={styles.bottomSection}>
        <Text style={styles.logoText}>UNISPACE</Text>
        <TouchableOpacity
          style={styles.policySection}
          onPress={() => setPolicyExpanded(!policyExpanded)}
        >
          <View style={styles.orangeTriangle} />
          <Text style={styles.policyText}>CHÍNH SÁCH</Text>
        </TouchableOpacity>
      </View>

      {/* Policy content */}
      {policyExpanded && (
        <View style={styles.dropdownContent}>
          <Text>Chính sách sử dụng website</Text>
          <Text>Phương thức thanh toán</Text>
          <Text>Chính sách đổi trả</Text>
          <Text>Chính sách giao nhận - vận chuyển</Text>
          <Text>Điều khoản dịch vụ</Text>
          <Text>Hướng dẫn mua hàng</Text>
          <Text>Chính sách bảo mật</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingBottom: 40,
  },
  dropdownSection: {
    marginBottom: 30,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdownContent: {
    padding: 10,
  },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logoText: {
    fontSize: 26,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  policySection: {
    alignItems: "flex-end",
  },
  orangeTriangle: {
    width: 40,
    height: 40,
    backgroundColor: "#FF6B00",
    transform: [{ skewX: "-20deg" }],
    marginBottom: 10,
  },
  policyText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Footer;
