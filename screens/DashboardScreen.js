import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { baseUrl } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function DashboardScreen({ navigation }) {
  const [userCount, setUserCount] = useState(0);
  const [cameraCount, setCameraCount] = useState(0);
  const [rentedCount, setRentedCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userResponse = await axios.get(`${baseUrl}/users/count`);
        const cameraResponse = await axios.get(`${baseUrl}/camera/count`);
        const rentedResponse = await axios.get(`${baseUrl}/rental/count`);
        setUserCount(userResponse.data.count);
        setCameraCount(cameraResponse.data.count);
        setRentedCount(rentedResponse.data.count);
      } catch (error) {
        console.error(error.response);
        const errorMessage =
          error.response?.data || "An error occurred. Please try again later.";
        Alert.alert("Error", errorMessage);
      }
    };

    fetchCounts();
  }, []); // Dependency array to run only once

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Admin Page</Text>
        <TouchableOpacity style={styles.hamburger} onPress={toggleSidebar}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Sidebar */}
      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View style={styles.overlay}>
            <ScrollView style={styles.sidebar}>
              <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
                <FontAwesome name="home" size={20} color="white" />
                <Text style={styles.navText}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate("CameraManagement")}
              >
                <FontAwesome name="camera" size={20} color="white" />
                <Text style={styles.navText}>Management Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate("RentManagement")}
              >
                <FontAwesome name="history" size={20} color="white" />
                <Text style={styles.navText}>Management Rent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate("ScanQRCode")}
              >
                <FontAwesome name="user-secret" size={20} color="white" />
                <Text style={styles.navText}>Scan QR</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
                <FontAwesome name="sign-out" size={20} color="white" />
                <Text style={styles.navText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* Content */}
      <View style={styles.content}>
        <ScrollView>
          <View style={styles.cardContainer}>
            <View style={[styles.card, styles.cardPrimary]}>
              <FontAwesome name="user" size={40} color="white" />
              <View>
                <Text style={styles.cardTitle}>Jumlah User</Text>
                <Text style={styles.cardText}>{userCount}</Text>
              </View>
            </View>
            <View style={[styles.card, styles.cardWarning]}>
              <FontAwesome name="camera" size={40} color="white" />
              <View>
                <Text style={styles.cardTitle}>Jumlah kameras</Text>
                <Text style={styles.cardText}>{cameraCount}</Text>
              </View>
            </View>
            <View style={[styles.card, styles.cardSuccess]}>
              <FontAwesome name="shopping-cart" size={40} color="white" />
              <View>
                <Text style={styles.cardTitle}>Jumlah kamera yang disewa</Text>
                <Text style={styles.cardText}>{rentedCount}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.footer}>&copy;2021 Sewa Barang</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  navbar: {
    height: 60,
    backgroundColor: "#343a40",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  navbarTitle: {
    color: "white",
    fontSize: 20,
  },
  hamburger: {
    padding: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.4,
    height: "100%",
    backgroundColor: "#343a40",
    paddingVertical: 20,
    zIndex: 1100,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeNavItem: {
    backgroundColor: "#007bff",
  },
  navText: {
    color: "white",
    marginLeft: 10,
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  cardContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
  },
  cardPrimary: {
    backgroundColor: "#007bff",
  },
  cardWarning: {
    backgroundColor: "#ffc107",
  },
  cardSuccess: {
    backgroundColor: "#28a745",
  },
  cardTitle: {
    color: "white",
    fontSize: 16,
  },
  cardText: {
    color: "white",
    fontSize: 20,
  },
  footer: {
    textAlign: "center",
    color: "#6c757d",
    marginTop: 10,
  },
});
