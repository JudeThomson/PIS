import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import TopBar from "../components/TopBar";
const BookedPatients = () => {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.243:8000/api/appointments"
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    }
  };

  // Inside your component
  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("BasicHealthParameter", {
          patientId: item.patient_id,
          patientName: item.patient_name,
          sex: item.sex,
          obsID: item.obs_id,
        })
      }
    >
      <Text style={styles.name}>Patient ID: {item.patient_id}</Text>
      <Text style={styles.details}>Symptom: {item.symptom}</Text>
      <Text style={styles.details}>Date: {item.appoint_date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar
        title="Basic Health Parameters"
        navigation={navigation}
        onRefresh={fetchAppointments}
      />
      <Text style={styles.title}></Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f5f5f5", flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, marginTop: 15 },
  item: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  details: { fontSize: 14, color: "#555" },
});

export default BookedPatients;
