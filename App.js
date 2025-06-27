import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, StyleSheet } from "react-native";

import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen"; // Import HomeScreen
import RegisterScreen from "./screens/RegisterScreen";
import ModalScreen from "./screens/ModalScreen";
import HistoryScreen from "./screens/HistoryScreen";
import DetailScreen from "./screens/DetailScreen"; // Import DetailScreen
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DashboardScreen from "./screens/DashboardScreen"; // Import the DashboardScreen
import QrScreen from "./screens/QrScreen"; // Import QrScreen
import CameraManagementScreen from "./screens/CameraManagementScreen"; // Import CameraManagementScreen
import ScanQRCodeScreen from "./screens/ScanQRCodeScreen";
import RentManagementScreen from "./screens/RentManagementScreen"; // Import RentManagementScreen

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      const role = await AsyncStorage.getItem("userRole");
      setIsLoggedIn(!!token); // Jika token ada, isLoggedIn akan menjadi true
      setUserRole(role);
    };
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return null; // Tampilkan splash screen atau loading sementara
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {isLoggedIn ? (
            <>
              {userRole == "admin" ? (
                // Jika user adalah admin
                <>
                  <Stack.Screen name="Dashboard" component={DashboardScreen} />
                  <Stack.Screen
                    name="CameraManagement"
                    component={CameraManagementScreen}
                  />
                  <Stack.Screen
                    name="RentManagement"
                    component={RentManagementScreen}
                  />
                  <Stack.Screen
                    name="ScanQRCode"
                    component={ScanQRCodeScreen}
                  />
                  <Stack.Screen name="Cart" component={CartScreen} />
                  <Stack.Screen name="History" component={HistoryScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Detail" component={DetailScreen} />
                  {/* Ensure DetailScreen is included */}
                  <Stack.Screen name="Modal" component={ModalScreen} />
                  <Stack.Screen name="QrScreen" component={QrScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />

                  <Stack.Screen name="Home" component={HomeScreen} />
                  {/* Add QrScreen */}
                </>
              ) : (
                // Jika user adalah user biasa
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Cart" component={CartScreen} />
                  <Stack.Screen name="History" component={HistoryScreen} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Detail" component={DetailScreen} />
                  {/* Ensure DetailScreen is included */}
                  <Stack.Screen name="Modal" component={ModalScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="QrScreen" component={QrScreen} />
                  <Stack.Screen name="Dashboard" component={DashboardScreen} />

                  {/* Add QrScreen */}
                  <Stack.Screen
                    name="CameraManagement"
                    component={CameraManagementScreen}
                  />
                  <Stack.Screen
                    name="RentManagement"
                    component={RentManagementScreen}
                  />
                  <Stack.Screen
                    name="ScanQRCode"
                    component={ScanQRCodeScreen}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Detail" component={DetailScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="QrScreen" component={QrScreen} />
              <Stack.Screen
                name="CameraManagement"
                component={CameraManagementScreen}
              />
              <Stack.Screen
                name="RentManagement"
                component={RentManagementScreen}
              />
              <Stack.Screen name="ScanQRCode" component={ScanQRCodeScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="History" component={HistoryScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Detail" component={DetailScreen} />
              {/* Add QrScreen */}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 30, // Adjust the padding to provide more space at the top
  },
});
