import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";
import TopBar from "../components/TopBar";
import { useNavigation } from "@react-navigation/native";
const BookingAppointment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId } = route.params || {};

  const [form, setForm] = useState({
    staff_id: "",
    department_code: "",
    patient_id: patientId,
    symptom: "",
    duration: "",
    appoint_date: new Date(),
    appoint_time: new Date(),
    token: "",
  });

  const [staffList, setStaffList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fetchDropdownData = async () => {
    try {
      const [staff, depts, patients] = await Promise.all([
        axios.get("http://192.168.0.243:8000/api/staff"),
        axios.get("http://192.168.0.243:8000/api/department"),
        axios.get("http://192.168.0.243:8000/api/patients"),
      ]);
      setStaffList(staff.data);
      setDepartmentList(depts.data);
      setPatientList(patients.data);
    } catch (err) {
      console.error("❌ Error fetching dropdown data:", err);
      Alert.alert(
        "Error",
        "Failed to load dropdown options. Please try again."
      );
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const handleSubmit = async () => {
    try {
      const payload = {
        staff_id: form.staff_id,
        department_code: form.department_code,
        patient_id: form.patient_id,
        symptom: form.symptom,
        duration: form.duration,
        appoint_date: form.appoint_date.toISOString().split("T")[0],
        appoint_time: form.appoint_time.toTimeString().split(" ")[0],
        token: form.token,
      };

      console.log("Submitting:", payload);

      await axios.post("http://192.168.0.243:8000/api/appointments", payload);
      Alert.alert("Success", "Appointment booked!");
    } catch (error) {
      console.error("❌ Error:", error);
      Alert.alert("Error", "Failed to book appointment.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TopBar title="Booking Appointment" navigation={navigation} />
      <View style={{ padding: 16 }}>
        <Text style={styles.label}>Staff</Text>
        <Picker
          selectedValue={form.staff_id}
          onValueChange={(value) => handleChange("staff_id", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Staff" value="" />
          {staffList.map((staff) => (
            <Picker.Item
              key={staff.staff_id}
              label={staff.staff_name}
              value={staff.staff_id}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Department</Text>
        <Picker
          selectedValue={form.department_code}
          onValueChange={(value) => handleChange("department_code", value)}
          style={styles.picker}
        >
          <Picker.Item label="Select Department" value="" />
          {departmentList.map((dept) => (
            <Picker.Item
              key={dept.department_code}
              label={dept.department_name}
              value={dept.department_code}
            />
          ))}
        </Picker>

        <Text style={styles.label}>Patient</Text>
        <TextInput
          placeholder="Patient ID"
          value={patientId}
          editable={false}
        />

        <Text style={styles.label}>Symptom</Text>
        <TextInput
          style={styles.input}
          placeholder="Symptom"
          onChangeText={(text) => handleChange("symptom", text)}
        />

        <Text style={styles.label}>Duration</Text>
        <TextInput
          style={styles.input}
          placeholder="Duration (e.g., 2 days)"
          onChangeText={(text) => handleChange("duration", text)}
        />

        <Text style={styles.label}>Appointment Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text>{form.appoint_date.toISOString().split("T")[0]}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={form.appoint_date}
            onChange={(e, date) => {
              setShowDatePicker(false);
              if (date) handleChange("appoint_date", date);
            }}
          />
        )}

        <Text style={styles.label}>Appointment Time</Text>
        <TouchableOpacity
          onPress={() => setShowTimePicker(true)}
          style={styles.input}
        >
          <Text>{form.appoint_time.toTimeString().split(" ")[0]}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            mode="time"
            value={form.appoint_time}
            onChange={(e, time) => {
              setShowTimePicker(false);
              if (time) handleChange("appoint_time", time);
            }}
          />
        )}

        <Text style={styles.label}>Token</Text>
        <TextInput
          style={styles.input}
          placeholder="Token Number"
          keyboardType="numeric"
          onChangeText={(text) => handleChange("token", text)}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkcyan",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: {
    backgroundColor: "#fff",
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: "darkcyan",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default BookingAppointment;
