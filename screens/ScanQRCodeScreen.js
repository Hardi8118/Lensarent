import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

const ScanQRCodeScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("Camera Permission Status:", status);
      setHasPermission(status === "granted");
      console.log("Camera Constants:", Camera.Constants); // Debug Constants
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text>Camera is ready!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ScanQRCodeScreen;
