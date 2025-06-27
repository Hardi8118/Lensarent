import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Button, // Import Button component
} from "react-native";
import axios from "axios";
import { WebView } from "react-native-webview";
import { formatCurrency } from "../utils/formatCurrency"; // Import the utility function
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../utils/api";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import { images } from "./imageMapping";
const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snapToken, setSnapToken] = useState(null);
  const [profile, setProfile] = useState({});
  const [isWebViewVisible, setIsWebViewVisible] = useState(true);
  const [showCurrentOrders, setShowCurrentOrders] = useState(true); // Add state variable

  const fetchHistory = async () => {
    try {
      const userId = await AsyncStorage.getItem("userToken");
      const response = await axios.get(`${baseUrl}/rentals/${userId}`);
      setHistory(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = await AsyncStorage.getItem("userToken");
        const response = await axios.get(`${baseUrl}/profile/${userId}`);
        setProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch profile data");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const handlePayment = async (orderId, amount, customerDetails) => {
    try {
      const response = await axios.post(`${baseUrl}/createTransaction`, {
        orderId,
        amount,
        customerDetails,
      });
      setSnapToken(response.data.token);
    } catch (error) {
      Alert.alert("Error", "Failed to initiate payment");
    }
  };

  const handlePaymentSuccess = async (orderId) => {
    console.log("success");
    Alert.alert("Success", "Payment completed");
    setIsWebViewVisible(false); // Close WebView
    setSnapToken(null); // Reset snapToken

    try {
      await axios.post(`${baseUrl}/paymentNotification`, {
        order_id: orderId,
        transaction_status: "settlement",
      });
      // Refresh history after payment success
      fetchHistory();
    } catch (error) {
      console.error("Error updating rental status:", error);
    }

    // Navigasi ke halaman Home
    navigation.navigate("Home");
  };

  if (snapToken) {
    return (
      <View style={styles.container}>
        {isWebViewVisible && snapToken ? (
          <>
            <WebView
              source={{
                uri: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${snapToken}`,
              }}
              onNavigationStateChange={(event) => {
                console.log("WebView URL:", event.url); // Log the URL
                const urlParams = new URLSearchParams(event.url.split("?")[1]);
                const orderId = urlParams.get("order_id");
                if (
                  event.url.includes("transaction_status=settlement") &&
                  orderId
                ) {
                  handlePaymentSuccess(orderId);
                }
              }}
              style={styles.webView}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsWebViewVisible(false);
                setSnapToken(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Button
            title="Go to Home"
            onPress={() => navigation.navigate("Home")}
          />
        )}
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00A19D" />
      </View>
    );
  }

  const currentOrders = history.filter(
    (item) =>
      item.status === "Menunggu Pembayaran" ||
      item.status === "Sudah Bayar" ||
      item.status === "Sedang menyewa"
  );

  const pastOrders = history.filter(
    (item) =>
      item.status !== "Menunggu Pembayaran" &&
      item.status !== "Sudah Bayar" &&
      item.status !== "Sedang Menyewa"
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.navbar}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="wihte"
          onPress={() => {
            navigation.goBack();
            // Refresh the page
          }}
        />
        <Text style={styles.navbarText}>Cek Riwayat</Text>
        <TouchableOpacity onPress={fetchHistory} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.switchButton,
            showCurrentOrders && styles.activeButton,
          ]}
          onPress={() => setShowCurrentOrders(true)}
        >
          <Text style={styles.buttonText}>Order Saat Ini</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.switchButton,
            !showCurrentOrders && styles.activeButton,
          ]}
          onPress={() => setShowCurrentOrders(false)}
        >
          <Text style={styles.buttonText}>Order Terdahulu</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        {showCurrentOrders ? (
          <>
            <Text style={styles.sectionTitle}>Order Saat Ini</Text>
            {currentOrders.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardBody}>
                  <Image
                    source={images[item.camera_image]}
                    style={styles.image}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.camera_name}</Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Peminjaman: </Text>
                      {new Date(item.start_date).toLocaleDateString("id-ID")}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Pengembalian: </Text>
                      {new Date(item.end_date).toLocaleDateString("id-ID")}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Durasi Sewa: </Text>
                      {Math.ceil(
                        (new Date(item.end_date) - new Date(item.start_date)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      Hari
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Biaya Sewa: </Text>
                      {formatCurrency(item.camera_price)}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Total Biaya: </Text>
                      {formatCurrency(item.total_cost)}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Status: </Text>
                      <Text style={styles.statusConfirmed}>{item.status}</Text>
                    </Text>
                    {item.status === "Menunggu Pembayaran" && (
                      <TouchableOpacity
                        style={styles.returnButton}
                        onPress={() =>
                          handlePayment(item.id, item.total_cost, {
                            first_name: profile.name,
                            last_name: "",
                            email: profile.email,
                            phone: profile.phone,
                          })
                        }
                      >
                        <Text style={styles.returnButtonText}>
                          Bayar sekarang
                        </Text>
                      </TouchableOpacity>
                    )}
                    {item.status === "Sudah Bayar" && (
                      <TouchableOpacity
                        style={styles.qrButton}
                        onPress={() =>
                          navigation.navigate("QrScreen", { orderId: item.id })
                        }
                      >
                        <Text style={styles.qrButtonText}>Lihat QR</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Order Terdahulu</Text>
            {pastOrders.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardBody}>
                  <Image
                    source={images[item.camera_image]}
                    style={styles.image}
                  />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.camera_name}</Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Peminjaman: </Text>
                      {new Date(item.start_date).toLocaleDateString("id-ID")}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Pengembalian: </Text>
                      {new Date(item.end_date).toLocaleDateString("id-ID")}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Durasi Sewa: </Text>
                      {Math.ceil(
                        (new Date(item.end_date) - new Date(item.start_date)) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      Hari
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Biaya Sewa: </Text>
                      {formatCurrency(item.camera_price)}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Total Biaya: </Text>
                      {formatCurrency(item.total_cost)}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Status: </Text>
                      <Text style={styles.statusConfirmed}>{item.status}</Text>
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a4b",
    padding: 10,
    justifyContent: "space-between", // Add space between elements
  },
  navbarIcon: {
    color: "white",
    fontSize: 20,
  },
  navbarText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    flex: 1,
  },
  refreshButton: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardBody: {
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    marginLeft: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 14,
    marginTop: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  statusConfirmed: {
    color: "green",
    borderWidth: 1,
    borderColor: "green",
    padding: 2,
    borderRadius: 5,
  },
  returnButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  returnButtonText: {
    color: "white",
    textAlign: "center",
  },
  qrButton: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
  },
  qrButtonText: {
    color: "white",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  webView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  switchButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  activeButton: {
    backgroundColor: "#1a1a4b",
  },
  buttonText: {
    color: "white",
  },
});

export default HistoryScreen;
