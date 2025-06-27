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
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

export default function RentManagementScreen({ navigation }) {
  const [rents, setRents] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };

    const fetchRents = async () => {
      try {
        const response = await axios.get(`${baseUrl}/rentals`);
        setRents(response.data);
      } catch (error) {
        console.error(error.response);
        const errorMessage =
          error.response?.data || "An error occurred. Please try again later.";
        Alert.alert("Error", errorMessage);
      }
    };

    fetchUserRole();
    fetchRents();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole");
    navigation.navigate("Login");
  };

  const handleChangeStatus = async (rentId, newStatus) => {
    try {
      await axios.put(`${baseUrl}/rentstatus/${rentId}`, {
        status: newStatus,
      });
      setRents(
        rents.map((rent) =>
          rent.id === rentId ? { ...rent, status: newStatus } : rent
        )
      );
      Alert.alert("Success", "Rent status updated successfully");
    } catch (error) {
      console.error(error.response);
      const errorMessage =
        error.response?.data || "An error occurred. Please try again later.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Management Rent</Text>
        <TouchableOpacity style={styles.hamburger} onPress={toggleSidebar}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {isSidebarOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View style={styles.overlay}>
            <ScrollView style={styles.sidebar}>
              <TouchableOpacity
                style={[styles.navItem]}
                onPress={() => navigation.navigate("Dashboard")}
              >
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
                <FontAwesome name="undo" size={20} color="white" />
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
      <ScrollView>
        <View style={styles.cardContainer}>
          {rents.map((rent, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.label}>Camera Name:</Text>
                <Text style={styles.value}>{rent.camera_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>User Name:</Text>
                <Text style={styles.value}>{rent.user_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{rent.status}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Change Status:</Text>
                <Picker
                  selectedValue={rent.status}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleChangeStatus(rent.id, itemValue)
                  }
                >
                  <Picker.Item label="Sudah Bayar" value="Sudah Bayar" />
                  <Picker.Item label="Sedang Menyewa" value="Sedang Menyewa" />
                  <Picker.Item
                    label="Sudah Dikembalikan"
                    value="Sudah Dikembalikan"
                  />
                  <Picker.Item label="Dibatalkan" value="Dibatalkan" />
                </Picker>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  navbar: {
    height: 60,
    backgroundColor: "#343a40",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
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
    width: width * 0.5,
    backgroundColor: "#343a40",
    paddingVertical: 20,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  navText: {
    color: "white",
    marginLeft: 10,
    fontSize: 15,
  },
  cardContainer: {
    marginTop: 50,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#555",
  },
  picker: {
    height: 20,
    width: 200,
  },
});
