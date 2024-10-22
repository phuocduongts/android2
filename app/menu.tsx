import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface MenuItem {
  name: string;
  subMenu?: MenuItem[];
}

const Menu = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/categories"
      );
      const data = await response.json();

      const transformedData = [
        { name: "Tất cả sản phẩm" },
        ...data.map((category: string) => ({
          name: category.charAt(0).toUpperCase() + category.slice(1),
          originalName: category, // Lưu tên gốc của category để sử dụng trong API
          subMenu:
            category === "clothing"
              ? [
                  { name: "Áo thun", originalName: "t-shirts" },
                  { name: "Áo khoác", originalName: "jackets" },
                  { name: "Áo polo", originalName: "polos" },
                ]
              : undefined,
        })),
      ];

      setCategories(transformedData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch categories");
      setLoading(false);
    }
  };

  const handleCategoryPress = (item: MenuItem) => {
    if (item.subMenu) {
      toggleSubMenu(item.name);
    } else {
      // Nếu là "Tất cả sản phẩm"
      if (item.name === "Tất cả sản phẩm") {
        navigation.navigate(
          "ProductList" as never,
          {
            category: "all",
            title: "Tất cả sản phẩm",
          } as never
        );
      } else {
        // Điều hướng đến trang sản phẩm với category tương ứng
        navigation.navigate(
          "productList" as never,
          {
            category: item.originalName,
            title: item.name,
          } as never
        );
      }
    }
  };

  const handleSubCategoryPress = (subItem: MenuItem) => {
    navigation.navigate(
      "productList" as never,
      {
        category: subItem.originalName,
        title: subItem.name,
      } as never
    );
  };

  const toggleSubMenu = (name: string) => {
    setActiveSubMenu(activeSubMenu === name ? null : name);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
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
    <View style={styles.container}>
      {categories.map((item: MenuItem, index: number) => (
        <View key={index} style={styles.menuItem}>
          {item.subMenu ? (
            <>
              <TouchableOpacity onPress={() => handleCategoryPress(item)}>
                <Text style={styles.menuTitle}>{item.name}</Text>
              </TouchableOpacity>
              {activeSubMenu === item.name && (
                <View style={styles.subMenu}>
                  {item.subMenu.map((subItem, subIndex) => (
                    <TouchableOpacity
                      key={subIndex}
                      onPress={() => handleSubCategoryPress(subItem)}
                    >
                      <Text style={styles.subMenuItem}>{subItem.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          ) : (
            <TouchableOpacity onPress={() => handleCategoryPress(item)}>
              <Text style={styles.menuTitle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  menuItem: {
    marginHorizontal: 10,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: "center",
    backgroundColor: "#f8f9fa",
  },
  subMenu: {
    marginTop: 5,
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 5,
    position: "absolute",
    top: "100%",
    left: 0,
    zIndex: 1,
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subMenuItem: {
    fontSize: 14,
    color: "#555",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Menu;
