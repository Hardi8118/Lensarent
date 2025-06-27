import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import axios from "axios";
import { baseUrl } from "../utils/api"; // Import the baseUrl

export default function App({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [kabupaten, setKabupaten] = useState("");
  const [alamat, setAlamat] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(""); // Add phone state

  const handleRegister = async () => {
    if (name && email && kabupaten && alamat && password && phone) {
      // Include phone in validation
      try {
        await axios.post(`${baseUrl}/register`, {
          name,
          email,
          kabupaten,
          alamat,
          password,
          phone, // Include phone in request
        });
        Alert.alert("Success", "Registration successful", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } catch (error) {
        const errorMessage = error.response?.data || "Registration failed";
        Alert.alert("Error", errorMessage);
      }
    } else {
      Alert.alert("Error", "Please fill all fields");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar dulu Yuk!</Text>
        <Text style={styles.headerSubtitle}>
          Sebelum kamu bisa nikmatin aplikasi, Sewabarang!
        </Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Lengkap"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kabupaten</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan Kabupaten"
            value={kabupaten}
            onChangeText={setKabupaten}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan Alamat"
            value={alamat}
            onChangeText={setAlamat}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nomor HP</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan Nomor HP"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kata Sandi</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukan Kata Sandi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <Text style={styles.terms}>
          Dengan mendaftar, Anda setuju dengan kami
          <Text style={styles.link}>Terms of service</Text> &
          <Text style={styles.link}>Privacy policy</Text>
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>DAFTAR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate("Login")}
        >
          <Text>
            Sudah punya akun? <Text style={styles.link}>Masuk disini</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ff7e5f",
    paddingVertical: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "white",
    fontSize: 14,
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  terms: {
    fontSize: 12,
    color: "#7f8c8d",
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#007bff",
  },
  button: {
    backgroundColor: "#2c3e50",
    borderRadius: 25,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 20,
    alignItems: "center",
  },
});
