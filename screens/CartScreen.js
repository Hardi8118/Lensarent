import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../utils/formatCurrency"; // Import the utility function
import { useFocusEffect } from "@react-navigation/native";

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    const cartItems = JSON.parse(await AsyncStorage.getItem("cart")) || [];
    setCart(cartItems);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCart();
    }, [])
  );

  const handleRemoveItem = async (index) => {
    try {
      const updatedCart = [...cart];
      updatedCart.splice(index, 1);
      setCart(updatedCart);
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
      Alert.alert("Success", "Item removed from cart");
      fetchCart(); // Refresh the cart
    } catch (error) {
      Alert.alert("Error", "Failed to remove item from cart");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => {
            navigation.goBack();
            fetchCart(); // Refresh the page
          }}
        />
        <Text style={styles.navbarTitle}>Cart</Text>
      </View>
      <ScrollView style={styles.content}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Cart is empty</Text>
          </View>
        ) : (
          cart.map((item, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.cardBody}>
                <View style={styles.itemDetails}>
                  <View style={styles.itemInfo}>
                    <Text>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {formatCurrency(item.price)}
                    </Text>
                  </View>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.itemThumbnail}
                  />
                </View>
                <View style={styles.itemPeriod}>
                  <Text>Availability: {item.availability}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveItem(index)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
    backgroundColor: "#1a1a5e",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  navbarTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#888",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 10,
  },
  cardBody: {
    padding: 10,
  },
  itemDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemPrice: {
    color: "green",
  },
  itemThumbnail: {
    width: 50,
    height: 50,
  },
  itemPeriod: {
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: "white",
  },
});

export default CartScreen;
