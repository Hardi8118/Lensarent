import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../utils/api"; // Import the baseUrl

const { width, height } = Dimensions.get("window");

export default function App({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      try {
        const response = await axios.post(`${baseUrl}/login`, {
          email,
          password,
        });
        const { user } = response.data;
        await AsyncStorage.setItem("userToken", user.id.toString());
        await AsyncStorage.setItem("userRole", user.role.toString());
        Alert.alert("Success", "Login successful", [
          {
            text: "OK",
            onPress: () => {
              if (user.role === "admin") {
                navigation.navigate("Dashboard");
              } else {
                navigation.navigate("Home");
              }
            },
          },
        ]);
      } catch (error) {
        const errorMessage =
          error.response?.data || "An error occurred. Please try again later.";
        Alert.alert("Error", errorMessage);
      }
    } else {
      Alert.alert("Error", "Please fill all fields");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Selamat Datang</Text>
        <Text style={styles.headerSubtitle}>
          Yuk, Masuk & Nikmati Fitur Dan Aplikasi Sewabarang!
        </Text>
        <Image
          source={{
            uri: "https://storage.googleapis.com/a1aa/image/Nbjxh8fkwaVaSa3oO1Q7J8ZC8H8Sqq3e0uHe3jdDvxBfwg6PB.jpg",
          }}
          style={styles.headerImage}
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Masukan Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kata Sandi</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              placeholder="Masukan Kata Sandi"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>MASUK</Text>
        </TouchableOpacity>
        <View style={styles.registerLink}>
          <Text>
            Belum punya akun?{" "}
            <Text
              style={styles.registerLinkText}
              onPress={() => navigation.navigate("Register")}
            >
              Daftar disini
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ff5f6d",
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  headerImage: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 50,
    height: 50,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 30,
    marginHorizontal: 20,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  button: {
    backgroundColor: "#000080",
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
  registerLinkText: {
    color: "#000080",
  },
});
