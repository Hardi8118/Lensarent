import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image, // Import Image component
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCurrency } from "../utils/formatCurrency"; // Import the utility function
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { baseUrl } from "../utils/api"; // Import the baseUrl
import { images } from "./imageMapping";

const DetailScreen = ({ route, navigation }) => {
  const { cameraId } = route.params;
  const [camera, setCamera] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1))
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const fetchCameraDetails = async () => {
    try {
      const response = await axios.get(`${baseUrl}/cameras/${cameraId}`);
      setCamera(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      Alert.alert("Error", "Failed to fetch camera details");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCameraDetails();
    }, [cameraId])
  );

  useEffect(() => {
    const fetchCartCount = async () => {
      const cart = JSON.parse(await AsyncStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    fetchCartCount();
  }, []);

  const rentCamera = async () => {
    console.log("Renting camera...1");
    try {
      console.log("Renting camera...2");
      const userId = await AsyncStorage.getItem("userToken");
      const response = await axios.post(`${baseUrl}/rent`, {
        userId,
        cameraId,
        startDate,
        endDate,
      });

      const qrCodeUrl = response.data.qrCodeUrl;

      // Update camera status to "Tidak Tersedia"
      await axios.patch(`${baseUrl}/cameras/${cameraId}`, {
        status: "Tidak Tersedia",
      });

      Alert.alert("Success", "Camera rented successfully", [
        {
          text: "OK",
          onPress: () => navigation.navigate("History", { qrCodeUrl }),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to rent camera");
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
    if (currentDate >= endDate) {
      const newEndDate = new Date(currentDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const rentalDays = Math.ceil(
    (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
  );

  const totalCost = rentalDays * camera?.price;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00A19D" />
      </View>
    );
  }

  if (!camera) {
    return (
      <View style={styles.centered}>
        <Text>Camera not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => {
            navigation.goBack();
            fetchCameraDetails(); // Refresh the page
          }}
        />
        <Text style={styles.headerTitle}>{camera.name}</Text>
        <View style={styles.cartIconContainer}></View>
      </View>
      <View style={styles.content}>
        <Image
          source={images[camera.image]} // Add Image component
          style={styles.cameraImage}
        />
        <Text style={styles.description}>{camera.description}</Text>
        <Text style={styles.sectionTitle}>Jaminan</Text>
        <Text style={styles.text}>Kartu Tanda Penduduk & Kartu Keluarga</Text>
        <Text style={styles.sectionTitle}>Pilih Tanggal Pinjam</Text>
        <View style={styles.dateSection}>
          <TouchableOpacity
            style={styles.dateContainer}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateLabel}>Peminjaman</Text>
            <Text style={styles.date}>
              {startDate.toLocaleDateString("id-ID")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dateContainer}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateLabel}>Pengembalian</Text>
            <Text style={styles.date}>
              {endDate.toLocaleDateString("id-ID")}
            </Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
            minimumDate={new Date()} // Prevent selecting past dates
          />
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            minimumDate={new Date(startDate).setDate(startDate.getDate() + 1)} // Prevent selecting dates before the start date
          />
        )}
        <Text style={styles.sectionTitle}>Informasi Pinjaman</Text>
        <View style={styles.infoSection}>
          <Text style={styles.text}>Jumlah Hari</Text>
          <Text style={styles.info}>{rentalDays} Hari</Text>
        </View>
        <View style={styles.totalSection}>
          <Text style={styles.text}>Total</Text>
          <Text style={styles.total}>{formatCurrency(totalCost)}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={rentCamera}>
          <Text style={styles.buttonText}>Rent Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartIconContainer: {
    position: "relative",
  },
  cartBadge: {
    position: "absolute",
    right: -10,
    top: -10,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
  },
  content: {
    padding: 15,
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    color: "#999",
    marginTop: 20,
  },
  text: {
    fontSize: 14,
    marginTop: 5,
  },
  dateSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dateContainer: {
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 14,
  },
  date: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 14,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  info: {
    color: "#FFA500",
    fontWeight: "bold",
    fontSize: 14,
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  total: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#000080",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
});

export default DetailScreen;
