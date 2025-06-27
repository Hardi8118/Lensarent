import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import QRCode from "react-native-qrcode-svg";
import { baseUrl } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

const QrScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [modalVisible, setModalVisible] = useState(true);

  useEffect(() => {
    const fetchQrData = async () => {
      try {
        const userId = await AsyncStorage.getItem("userToken");
        const response = await axios.get(`${baseUrl}/rentals/${userId}`);
        const rental = response.data.find((item) => item.id === orderId);
        if (rental && rental.qr_code) {
          setQrData(rental.qr_code);
        } else {
          Alert.alert("Error", "QR code not found");
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch QR data");
        setLoading(false);
      }
    };
    fetchQrData();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00A19D" />
      </View>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
        navigation.goBack();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              setModalVisible(!modalVisible);
              navigation.goBack();
            }}
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          {qrData ? (
            <>
              <Text style={styles.title}>QR Code for Order ID: {orderId}</Text>
              <QRCode value={qrData} size={200} />
            </>
          ) : (
            <Text style={styles.errorText}>Failed to load QR data</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default QrScreen;
