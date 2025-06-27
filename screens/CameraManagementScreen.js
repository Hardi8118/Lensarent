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
  Image,
  TextInput,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { baseUrl } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCurrency } from "../utils/formatCurrency";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import { images } from "./imageMapping";
import * as DocumentPicker from "expo-document-picker";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // Import Picker
const { width } = Dimensions.get("window");

export default function CameraManagementScreen({ navigation }) {
  const [cameras, setCameras] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraData, setCameraData] = useState({
    name: "",
    description: "",
    price: "",
    availability: "",
    image: "",
  });
  const [userRole, setUserRole] = useState(null); // Add state for user role
  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${baseUrl}/cameras`);
      setCameras(response.data);
    } catch (error) {
      console.error(error.response);
      const errorMessage =
        error.response?.data || "An error occurred. Please try again later.";
      Alert.alert("Error", errorMessage);
    }
  };
  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    };

    fetchUserRole();
    fetchCameras();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userRole"); // Remove user role on logout
    navigation.navigate("Login");
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAddCamera = () => {
    setSelectedCamera(null);
    setCameraData({
      name: "",
      description: "",
      price: "",
      availability: "",
      image: "",
    });
    setIsModalVisible(true);
  };

  const handleEditCamera = (camera) => {
    setSelectedCamera(camera);
    setCameraData({
      name: camera.name,
      description: camera.description,
      price: camera.price,
      availability: camera.availability,
      image: camera.image,
    });
    setIsModalVisible(true);
  };

  const handleDeleteCamera = async (cameraId) => {
    try {
      await axios.delete(`${baseUrl}/cameras/${cameraId}`);
      setCameras(cameras.filter((camera) => camera.id !== cameraId));
      Alert.alert("Camera deleted successfully");
    } catch (error) {
      console.error(error.response);
      const errorMessage =
        error.response?.data || "An error occurred. Please try again later.";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleSaveCamera = async () => {
    // Form validation
    if (
      !cameraData.name ||
      !cameraData.description ||
      !cameraData.price ||
      !cameraData.availability ||
      !cameraData.image
    ) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      if (selectedCamera) {
        console.log("selectedCamera", selectedCamera);
        // Update camera
        const response = await axios.put(
          `${baseUrl}/cameras/${selectedCamera.id}`,
          cameraData
        );
        setCameras(
          cameras.map((camera) =>
            camera.id === selectedCamera.id ? response.data : camera
          )
        );
        var message = "Camera updated successfully";
      } else {
        // Add new camera
        const response = await axios.post(`${baseUrl}/cameras`, cameraData);
        setCameras([...cameras, response.data]);
        var message = "Camera added successfully";
      }
      setIsModalVisible(false);
      Alert.alert("Success", message, [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("CameraManagement");
          },
        },
      ]);
      fetchCameras();
    } catch (error) {
      console.error(error.response);
      const errorMessage =
        error.response?.data || "An error occurred. Please try again later.";
      Alert.alert("Erroree", errorMessage);
    }
  };

  const pickFile = async () => {
    console.log(cameraData);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // Mendukung semua jenis file
      });

      console.log("File selected1:", result.assets[0].name);
      if (result.assets[0].name) {
        setCameraData({ ...cameraData, image: result.assets[0].name });
        // setCameraData({ ...cameraData, image: result.assets[0].uri });
        // console.log("File selectedurl:", cameraData.image);
      } else {
        console.log("File selection cancelled.");
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick a file. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarTitle}>Management Camera</Text>
        <TouchableOpacity style={styles.hamburger} onPress={toggleSidebar}>
          <FontAwesome name="bars" size={24} color="white" />
        </TouchableOpacity>
      </View>
      {/* Sidebar */}
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
      <ScrollView>
        <View style={styles.cardContainer}>
          {cameras.map((camera, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => handleEditCamera(camera)}
            >
              <Image source={images[camera.image]} style={styles.cardImage} />
              <Text style={styles.cardTitle}>{camera.name}</Text>
              <Text style={styles.cardPrice}>
                {formatCurrency(camera.price)}
              </Text>
              <Text style={styles.cardAvailability}>{camera.availability}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCamera(camera.id)}
              >
                <FontAwesome name="trash" size={20} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCamera}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>
      {/* Modal */}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
            FORM
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={cameraData.name}
            onChangeText={(text) =>
              setCameraData({ ...cameraData, name: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={cameraData.description}
            onChangeText={(text) =>
              setCameraData({ ...cameraData, description: text })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={cameraData.price.toString()} // Konversi ke string untuk ditampilkan di TextInput
            onChangeText={(text) => {
              const numericValue = parseFloat(text); // Konversi input ke number
              if (!isNaN(numericValue)) {
                // Pastikan nilai yang dimasukkan adalah angka
                setCameraData({ ...cameraData, price: numericValue });
              } else {
                setCameraData({ ...cameraData, price: 0 }); // Atau nilai default lainnya jika input tidak valid
              }
            }}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={cameraData.availability}
            style={styles.input}
            onValueChange={(itemValue) =>
              setCameraData({ ...cameraData, availability: itemValue })
            }
          >
            <Picker.Item label="Tersedia" value="Tersedia" />
            <Picker.Item label="Tidak Tersedia" value="Tidak Tersedia" />
          </Picker>
          <TouchableOpacity style={styles.imagePicker} onPress={pickFile}>
            <Text style={styles.imagePickerText}>Pick a file</Text>
          </TouchableOpacity>
          {cameraData.image ? (
            cameraData.image.endsWith(".jpg") ||
            cameraData.image.endsWith(".png") ||
            cameraData.image.endsWith(".jpeg") ? (
              <Text>Selected file: {cameraData.image}</Text>
            ) : (
              <Text>Selected file: {cameraData.image}</Text>
            )
          ) : (
            <Text>Selected file: {cameraData.image}</Text>
          )}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveCamera}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    position: "absolute", // Navbar tetap di atas
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000, // Supaya navbar berada di atas konten lainnya
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Latar belakang transparan
    zIndex: 1000, // Menempatkan overlay di atas konten
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.5, // Lebar sidebar 70% layar
    height: "100%",
    backgroundColor: "#343a40",
    paddingVertical: 20,
    zIndex: 1100, // Menempatkan sidebar di atas overlay
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
    fontSize: 15,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    top: 40,
    marginBottom: 40,
  },
  card: {
    width: "45%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardPrice: {
    fontSize: 16,
    color: "green",
    marginTop: 5,
  },
  cardAvailability: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  deleteButton: {
    position: "absolute",
    padding: 5,
    top: 10,
    right: 10,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  imagePicker: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  imagePickerText: {
    color: "white",
    fontSize: 16,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
