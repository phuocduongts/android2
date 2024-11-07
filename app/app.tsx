import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "./productlist"; // Đường dẫn đến file ProductList
import ProductDetail from "./productdetail"; // Đường dẫn đến file ProductDetail
import Cart from "./cart";
import Checkout from "./checkout";
import RegisterScreen from "./register";
import LoginScreen from "./(tabs)";
import Home from "./home";
import ProductCategoryScreen from "./ProductCategoryScreen";
import Menu from "./menu";
import Toast from "react-native-toast-message";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ProductList">
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ title: "Danh sách sản phẩm" }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{ title: "Chi tiết sản phẩm" }}
        />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Cart">
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Checkout" component={Checkout} />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="cart"
          component={Cart}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="Menu">z
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen
          name="ProductCategoryScreen"
          component={ProductCategoryScreen}
        />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
      </Stack.Navigator>
      <Stack.Navigator initialRouteName="ProductDetail">
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
