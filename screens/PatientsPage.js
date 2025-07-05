// screens/PatientsPage.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  navigation,
} from "react-native";
import TopBar from "../components/TopBar";
import { getPatients, deletePatient } from "../services/patientService";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const PatientsPage = () => {
  const navigation = useNavigation();
  const [patients, setPatients] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const loadPatients = async () => {
    const data = await getPatients();
    setPatients(data);
  };
  const handleSearch = () => {
    const filtered = patients.filter((p) => {
      return (
        (searchId ? p.patient_id?.includes(searchId) : true) &&
        (searchName
          ? p.patient_name?.toLowerCase().includes(searchName.toLowerCase())
          : true) &&
        (searchPhone ? p.mobile?.includes(searchPhone) : true)
      );
    });
    setPatients(filtered);
  };

  const confirmDelete = (id) => {
    Alert.alert("Confirm Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          await deletePatient(id);
          loadPatients();
        },
      },
    ]);
  };
  useEffect(() => {
    loadPatients();
  }, []);

  const renderPatient = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.cell}>{item.patient_id}</Text>
      <Text style={styles.cell}>{item.patient_name}</Text>
      <Text style={styles.cell}>{item.mobile || "N/A"}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditPatient", { patientId: item._id })
          }
        >
          <Icon name="create-outline" size={20} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmDelete(item._id)}
          style={{ marginLeft: 15 }}
        >
          <Icon name="trash-outline" size={20} color="#dc3545" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar
        title="Patients"
        navigation={navigation}
        onRefresh={loadPatients}
      />
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Patient ID"
          value={searchId}
          onChangeText={setSearchId}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Patient Name"
          value={searchName}
          onChangeText={setSearchName}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Phone No"
          value={searchPhone}
          onChangeText={setSearchPhone}
          keyboardType="phone-pad"
        />

        <View style={styles.iconButtonRow}>
          <TouchableOpacity onPress={handleSearch}>
            <Icon
              name="search"
              size={24}
              color="#fff"
              style={styles.searchBtn}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("AddPatient")}>
            <Icon
              name="add-circle"
              size={24}
              color="#fff"
              style={styles.addBtn}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Patient ID</Text>
        <Text style={styles.headerCell}>Name</Text>
        <Text style={styles.headerCell}>Mobile</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View>

      <FlatList
        data={patients}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderPatient}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
  },
  cell: {
    flex: 1,
    fontSize: 14,
  },
  actions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "darkcyan",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: "#cc0000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "darkcyan",
    padding: 15,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  topTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  topRight: {
    flexDirection: "row",
  },
  iconBtn: {
    marginLeft: 15,
  },
  // Search Section
  searchSection: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    margin: 15,
    elevation: 3,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  iconButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  searchBtn: {
    backgroundColor: "darkcyan",
    padding: 10,
    borderRadius: 10,
  },
  addBtn: {
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 10,
  },
});

export default PatientsPage;
