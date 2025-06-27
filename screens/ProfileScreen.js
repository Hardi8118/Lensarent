import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../utils/api"; // Import the baseUrl

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem("userToken");
    navigation.navigate("Login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.label}>Nama Lengkap:</Text>
        <Text style={styles.value}>{profile.name}</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.email}</Text>
        <Text style={styles.label}>Kabupaten:</Text>
        <Text style={styles.value}>{profile.kabupaten}</Text>
        <Text style={styles.label}>Alamat:</Text>
        <Text style={styles.value}>{profile.alamat}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#1a1a5e",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#000080",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
