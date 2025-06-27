import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { baseUrl } from "../utils/api";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { formatCurrency } from "../utils/formatCurrency"; // Import the utility function
import { useFocusEffect } from "@react-navigation/native";
import CartScreen from "./CartScreen";
import ProfileScreen from "./ProfileScreen";
import HistoryScreen from "./HistoryScreen"; // Import the HistoryScreen
import { images } from "./imageMapping";

const HomeScreen = ({ navigation }) => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [imageName, setImageName] = useState(null);

  const fetchCameras = async () => {
    try {
      const response = await axios.get(`${baseUrl}/cameras`);
      const availableCameras = response.data.filter(
        (camera) => camera.availability === "Tersedia"
      ); // Filter available cameras
      setCameras(availableCameras);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCameras();
    }, [])
  );
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00A19D" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Lensa Rent</Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.banner}>
          <Image
            source={{
              uri: "https://storage.googleapis.com/a1aa/image/UMWIWeIVHcSiD6wRFYmm0ajh9ErxJBcaPPsPPiJKWYmvm0eTA.jpg",
            }}
            style={styles.bannerImage}
          />
          <Text style={styles.bannerText}>RENTAL CAMERA</Text>
        </View>
        <View style={styles.cardContainer}>
          {cameras.map((camera, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Detail", { cameraId: camera.id })
              } // Pass cameraId
            >
              <Image
                source={images[camera.image]} // Fix the image source logic
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>{camera.name}</Text>
              <Text style={styles.cardPrice}>
                {formatCurrency(camera.price)}
              </Text>
              <Text style={styles.cardAvailability}>{camera.availability}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      const cart = JSON.parse(await AsyncStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };
    fetchCartCount();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Profile") {
            iconName = "user";
          } else if (route.name === "History") {
            iconName = "history";
          }

          return (
            <Icon
              name={iconName}
              type="font-awesome"
              color={color}
              size={size}
            />
          );
        },

        headerShown: false,
      })}
      tabBarOptions={{
        activeTintColor: "#00A19D",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // Menjalankan ulang lifecycle HomeScreen
            navigation.navigate("Home");
          },
        })}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // Menjalankan ulang lifecycle HomeScreen
            navigation.navigate("History");
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={({ navigation }) => ({
          tabPress: () => {
            // Menjalankan ulang lifecycle HomeScreen
            navigation.navigate("Profile");
          },
        })}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00A19D",
    padding: 20,
    position: "sticky", // Make the header sticky
    zIndex: 1,
  },
  welcomeText: {
    color: "#fff",
    fontSize: 25,
  },
  headerIcons: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },
  banner: {
    alignItems: "center",
    marginVertical: 10,
  },
  bannerImage: {
    width: "100%",
    height: 200,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "white",
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    fontSize: 24,
  },
  navText: {
    color: "#6c757d",
  },
  activeNavItem: {
    color: "#1a1a5e",
  },
});

export default HomeTabs;
