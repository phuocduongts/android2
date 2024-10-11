import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

interface MenuItem {
  name: string;
  subMenu?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    name: "Tất cả sản phẩm",
  },
  {
    name: "Áo",
    subMenu: [{ name: "Áo thun" }, { name: "Áo khoác" }, { name: "Áo polo" }],
  },
  {
    name: "Quần",
  },
];

const Menu = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const toggleSubMenu = (name: string) => {
    setActiveSubMenu(activeSubMenu === name ? null : name);
  };

  return (
    <View style={styles.container}>
      {menuItems.map((item, index) => (
        <View key={index} style={styles.menuItem}>
          {item.subMenu ? (
            <>
              <TouchableOpacity onPress={() => toggleSubMenu(item.name)}>
                <Text style={styles.menuTitle}>{item.name}</Text>
              </TouchableOpacity>
              {activeSubMenu === item.name && (
                <View style={styles.subMenu}>
                  {item.subMenu.map((subItem, subIndex) => (
                    <Text key={subIndex} style={styles.subMenuItem}>
                      {subItem.name}
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <TouchableOpacity>
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
    flexWrap: "wrap", // Allow items to wrap to the next line if needed
    padding: 10,
  },
  menuItem: {
    marginHorizontal: 10, // Reduce spacing for mobile devices
    marginBottom: 10, // Add some vertical spacing between wrapped items
  },
  menuTitle: {
    fontSize: 16, // Slightly smaller font for mobile
    fontWeight: "bold",
    color: "#333",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5, // Add some border-radius for a modern look
    textAlign: "center",
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
    width: Dimensions.get("window").width * 0.8, // Make submenu wider for better touch experience
  },
  subMenuItem: {
    fontSize: 14,
    color: "#555",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

export default Menu;
