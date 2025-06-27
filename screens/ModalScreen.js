import React from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import HistoryScreen from "./HistoryScreen";

const App = ({ navigation }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Cek Riwayat</Text>
      </View>
      <View style={styles.tabContainer}>
        <Text style={[styles.tab, styles.activeTab]}>My Order</Text>
        <Text style={styles.tab}>History</Text>
      </View>
      <View style={styles.orderCard}>
        <Image
          source={{ uri: "https://placehold.co/100x100" }}
          style={styles.image}
        />
        <View style={styles.orderDetails}>
          <Text style={styles.orderTitle}>DSLR Canon EOS 80D</Text>
          <Text>Peminjaman: 29 Oct 21</Text>
          <Text>Pengembalian: 30 Oct 21</Text>
          <Text>Durasi Sewa: 1 Hari</Text>
          <Text>Biaya Sewa: Rp.225,000.00</Text>
          <Text>
            Status: <Text style={styles.status}>sudah dikonfirmasi</Text>
          </Text>
          <Button
            title="Kembalikan Barang"
            color="red"
            onPress={() => setModalVisible(true)}
          />
        </View>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text>Anda yakin ingin mengembalikan barang?</Text>
            <View style={styles.modalButtons}>
              <Button title="Ya" onPress={() => setModalVisible(false)} />
              <Button title="Tidak" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333",
  },
  header: {
    backgroundColor: "#1a1a1a",
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    color: "#fff",
    fontSize: 24,
    marginRight: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  tab: {
    padding: 10,
    color: "#000",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  orderCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
  },
  image: {
    width: 100,
    height: 100,
  },
  orderDetails: {
    marginLeft: 15,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    color: "green",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});

export default App;
