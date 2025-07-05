import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  CheckBox,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect } from "react";
import TopBar from "../components/TopBar";

const BasicHealthParameter = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId, patientName, sex, obsID } = route.params;
  const [patientInfo, setPatientInfo] = useState(null);
  const [form, setForm] = useState({
    temperature: "",
    heartRate: "",
    respiration: "",
    height: "",
    weight: "",
    bmi: "",
    bloodGroup: "",
    bloodPressure: "",
    bloodSugar: "",
    spo2: "",
    allergies: {
      coldWater: false,
      skin: false,
      smoke: false,
    },
  });
  const [healthData, setHealthData] = useState({
    temperature: "",
    heart_rate: "",
    respiration: "",
    height: "",
    weight: "",
    bmi: "",
    blood_group: "",
    blood_pressure: "",
    blood_sugar: "",
    spo2: "",
    // more fields...
  });

  const submitHealthData = async (status) => {
    try {
      const payload = {
        patient_id: patientId,
        user_id: "react_native",
        update_status: status,
        ...healthData,
      };

      await axios.post(
        "http://192.168.0.243:8000/api/health-parameters",
        payload
      );

      alert(
        status === 1 ? "✅ Confirmed successfully!" : "💾 Saved successfully."
      );
      navigation.goBack();
    } catch (err) {
      console.error("❌ Submission failed:", err);
      alert("Error saving health data.");
    }
  };

  const handleSave = () => submitHealthData(0);
  const handleConfirm = () => submitHealthData(1);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const calculateBMI = (height, weight) => {
    if (!height || !weight) return "";
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0) {
      return (w / (h * h)).toFixed(1).toString();
    }
    return "";
  };
  useEffect(() => {
    if (patientId && patientName) {
      setPatientInfo({
        patientId,
        patientName,
        sex,
        obsID,
      });
    }
  }, []);

  return (
    <ScrollView style={styles.container}>
      <TopBar
        title="Basic Health Parameters"
        navigation={navigation}
        onRefresh={BasicHealthParameter}
      />
      <View style={{ padding: 16 }}>
        <Text style={styles.sectionHeader}>Patient Information</Text>
        {patientInfo ? (
          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.value}>
                Patient ID: {patientInfo.patientId}
              </Text>
              <Text style={styles.value}>Name: {patientInfo.patientName}</Text>
              <Text style={styles.value}>Sex: {patientInfo.sex}</Text>
              <Text style={styles.value}>
                Observation ID: {patientInfo.obsID}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginBottom: 20 }}>
            Loading...
          </Text>
        )}
        <Text style={styles.sectionHeader}>Health Parameters</Text>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Temperature (F):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.temperature}
            onChangeText={(val) => handleChange("temperature", val)}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Heart Rate (bpm):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.heartRate}
            onChangeText={(val) => handleChange("heartRate", val)}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Respiration (brpm):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.respiration}
            onChangeText={(val) => handleChange("respiration", val)}
          />
        </View>
        {/* <View style={styles.inputRow}>
        <Text style={styles.label}>Allergies:</Text>
        <View style={{ flexDirection: "column", marginTop: 5 }}>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={form.allergies.coldWater}
              onValueChange={(val) =>
                handleChange("allergies", {
                  ...form.allergies,
                  coldWater: val,
                })
              }
            />
            <Text>Cold Water</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={form.allergies.skin}
              onValueChange={(val) =>
                handleChange("allergies", {
                  ...form.allergies,
                  skin: val,
                })
              }
            />
            <Text>Skin Allergy</Text>
          </View>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={form.allergies.smoke}
              onValueChange={(val) =>
                handleChange("allergies", {
                  ...form.allergies,
                  smoke: val,
                })
              }
            />
            <Text>Smoke Allergy</Text>
          </View>
        </View>
      </View>*/}
        <View style={styles.inputRow}>
          <Text style={styles.label}>Height (cm):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.height}
            onChangeText={(val) => {
              handleChange("height", val);
              handleChange("bmi", calculateBMI(val, form.weight));
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Weight (kg):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.weight}
            onChangeText={(val) => {
              handleChange("weight", val);
              handleChange("bmi", calculateBMI(form.height, val));
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>BMI:</Text>
          <Text style={styles.value}>{form.bmi}</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Blood Group:</Text>
          <TextInput
            style={styles.input}
            value={form.bloodGroup}
            onChangeText={(val) => handleChange("bloodGroup", val)}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Blood Pressure (mm/hg):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.bloodPressure}
            onChangeText={(val) => handleChange("bloodPressure", val)}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>Blood Sugar (mg/dL):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.bloodSugar}
            onChangeText={(val) => handleChange("bloodSugar", val)}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.label}>SpO2 (%):</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={form.spo2}
            onChangeText={(val) => handleChange("spo2", val)}
          />
        </View>
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleConfirm}>
            <Text style={styles.btnText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "darkcyan",

    borderRadius: 8,
    marginBottom: 12,
  },
  logo: { width: 40, height: 40, marginRight: 10 },
  title: { flex: 1, fontSize: 20, color: "white", fontWeight: "bold" },
  icons: { flexDirection: "row" },
  icon: { marginLeft: 12 },
  sectionHeader: {
    backgroundColor: "darkcyan",
    color: "white",
    padding: 8,
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 4,
    marginVertical: 10,
  },
  label: { fontWeight: "bold", marginBottom: 4, color: "#444" },
  value: { marginBottom: 8, fontSize: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 10,
  },
  inputRow: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  button: {
    backgroundColor: "darkcyan",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  btnText: { color: "white", textAlign: "center", fontWeight: "bold" },
});

export default BasicHealthParameter;
