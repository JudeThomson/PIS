// screens/DashboardScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>PIS (Patient Information System)</Text>
      {/* <Text style={{ fontSize: 20, textAlign: "center" }}>
        PIS Dashboard for Booking Appointments Module
      </Text> */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PatientsPage")}
        >
          <Image
            source={require("../assets/patients.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Patients</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("PatientAppointmentList")}
        >
          <Image
            source={require("../assets/appointment.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Booking Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("BookedPatients")}
        >
          <Image
            source={require("../assets/health_parameter.png")}
            style={styles.icon}
          />
          <Text style={styles.cardText}>Basic Health Parameter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    padding: 14,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "darkcyan",
    padding: 15,
    borderRadius: 8,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 25,
    width: "48%",
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DashboardScreen;
