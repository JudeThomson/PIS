// screens/AppointmentPatientList.js
import React, { use, useEffect, useState } from "react";
import { Alert } from "react-native";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { getPatients } from "../services/patientService";
import TopBar from "../components/TopBar";
const AppointmentPatientList = () => {
  useNavigation();
  const [patients, setPatients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const handlePatientSelect = async (patientId) => {
    try {
      const res = await axios.get(
        `http://192.168.0.243:8000/api/appointments/check/${patientId}`
      );

      if (res.data.booked) {
        Alert.alert(
          "Already Booked",
          "This patient already has a pending appointment."
        );
      } else {
        navigation.navigate("PatientAppointment", { patientId });
      }
    } catch (err) {
      console.error("❌ Error checking appointment:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };
  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
        setFiltered(data);
      } catch (err) {
        console.error("❌ Failed to load patients:", err);
      }
    };
    fetch();
  }, []);

  const handleSearch = (text) => {
    setSearch(text);
    const filteredData = patients.filter(
      (p) =>
        p.patient_id?.toLowerCase().includes(text.toLowerCase()) ||
        p.patient_name?.toLowerCase().includes(text.toLowerCase()) ||
        p.mobile?.toLowerCase().includes(text.toLowerCase())
    );
    setFiltered(filteredData);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handlePatientSelect(item.patient_id)}
    >
      <Text style={styles.title}>{item.patient_name}</Text>
      <Text>ID: {item.patient_id}</Text>
      <Text>Phone: {item.mobile}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar title="Booking Appointment" navigation={navigation} />
      <Text style={styles.header}>Select Patient</Text>
      <View style={{ padding: 16 }}>
        <View style={styles.searchBar}>
          <Icon
            name="search"
            size={20}
            color="#666"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Search by ID, Name or Phone"
            value={search}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.patient_id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 16,
    textAlign: "center",
    color: "darkcyan",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  searchInput: { flex: 1 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AppointmentPatientList;
