import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { getNextPatientId } from "../services/patientService";
import { Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import TopBar from "../components/TopBar";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RadioButton } from "react-native-paper";

const PatientRegistration = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    patientId: "",
    photo: null,
    patientName: "",
    age: "",
    sex: "Male",
    spouseName: "",
    fatherMotherName: "",
    location: "",
    mobile: "",
    skypeID: "",
    preferredCalling: "WhatsApp",
    uniqueID: "",
    confidential: false,
    referredBy: "",
    clinicName: "",
    dateOfBirth: new Date(),
    showDatePicker: false,
    maritalStatus: "Married",
    guardianName: "",
    occupation: "",
    income: "",
    homePhone: "",
    homeAddress: "",
    state: "",
    country: "",
    zipCode: "",
    email: "",
    emergencyName: "",
    emergencyRelation: "",
    emergencyMobile: "",
    emergencyPhone: "",
  });
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setFormData((prev) => ({
        ...prev,
        photo: {
          uri: asset.uri,
          name: "patient_photo.jpg",
          type: "image/jpeg",
        },
      }));
    }
  };
  const initializeForm = async (setFormData) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }

    const nextId = await getNextPatientId();
    setFormData((prev) => ({ ...prev, patientId: nextId }));
  };

  // Inside your component
  useEffect(() => {
    initializeForm(setFormData);
  }, []);
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    try {
      // Append all text fields to FormData
      formDataToSend.append("patient_id", formData.patientId);
      formDataToSend.append("patient_name", formData.patientName);
      formDataToSend.append("sex", formData.sex);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append(
        "birth_date",
        typeof formData.dateOfBirth === "string"
          ? formData.dateOfBirth
          : formData.dateOfBirth.toISOString().split("T")[0]
      );
      formDataToSend.append("spouse_name", formData.spouseName);
      formDataToSend.append("parent_name", formData.fatherMotherName);
      formDataToSend.append("guardian_name", formData.guardianName);
      formDataToSend.append("occupation", formData.occupation);
      formDataToSend.append("annual_income", formData.income);
      formDataToSend.append("marrital_status", formData.maritalStatus);
      formDataToSend.append("confidential", formData.confidential ? 1 : 0);
      formDataToSend.append("referral_id", formData.referredBy);
      formDataToSend.append("clinic", formData.clinicName);
      formDataToSend.append("city", formData.location);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("aadhaar_no", formData.uniqueID);

      // Append image file if available
      if (formData.photo) {
        formDataToSend.append("photo", {
          uri: formData.photo.uri,
          name: formData.photo.name,
          type: formData.photo.type,
        });
      }

      console.log("🚀 Submitting FormData to Laravel...");
      await axios.post(
        "http://192.168.0.243:8000/api/patients",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Patient registered!");
      navigation.goBack();
    } catch (error) {
      console.error("❌ API error:", error);
      alert("Failed to register patient");
    }
  };

  const handleCancel = () => {
    setFormData({
      photo: null,
      patientName: "",
      age: "",
      sex: "Male",
      spouseName: "",
      fatherMotherName: "",
      location: "",
      mobile: "",
      skypeID: "",
      preferredCalling: "WhatsApp",
      uniqueID: "",
      confidential: false,
      referredBy: "",
      clinicName: "",
      dateOfBirth: new Date(),
      showDatePicker: false,
      maritalStatus: "Married",
      guardianName: "",
      occupation: "",
      income: "",
      homePhone: "",
      homeAddress: "",
      state: "",
      country: "",
      zipCode: "",
      email: "",
      emergencyName: "",
      emergencyRelation: "",
      emergencyMobile: "",
      emergencyPhone: "",
    });
    console.log("Cancelled");
  };
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age.toString();
  };
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
    >
      <TopBar
        title="Patients"
        navigation={navigation}
        onRefresh={() => {
          initializeForm(setFormData);
        }}
      />
      {/* Basic Info */}
      <View style={{ padding: 20 }}>
        <View style={{ alignItems: "center", marginBottom: 20, marginTop: 20 }}>
          {formData.photo ? (
            <Image
              source={{ uri: formData.photo?.uri }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
            />
          ) : (
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "#ccc",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff" }}>No Image</Text>
            </View>
          )}

          <TouchableOpacity
            style={{
              marginTop: 10,
              backgroundColor: "darkcyan",
              paddingVertical: 6,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={pickImage}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Select Photo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient ID"
            value={formData.patientId}
            editable={false}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.patientName}
            onChangeText={(text) => handleChange("patientName", text)}
            placeholder="Enter name"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sex:</Text>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <RadioButton
              value="Male"
              status={formData.sex === "Male" ? "checked" : "unchecked"}
              onPress={() => handleChange("sex", "Male")}
            />
            <Text>Male</Text>

            <RadioButton
              value="Female"
              status={formData.sex === "Female" ? "checked" : "unchecked"}
              onPress={() => handleChange("sex", "Female")}
            />
            <Text>Female</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Age:</Text>
          <TextInput
            style={styles.input}
            value={formData.age}
            keyboardType="numeric"
            onChangeText={(text) => handleChange("age", text)}
            placeholder="Enter age"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Spouse Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Spouse Name"
            onChangeText={(text) => handleChange("spouseName", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Father Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Father/Mother Name"
            onChangeText={(text) => handleChange("fatherMotherName", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <TextInput
            style={styles.input}
            placeholder="Location"
            onChangeText={(text) => handleChange("location", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("mobile", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>skypeID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Skype ID"
            onChangeText={(text) => handleChange("skypeID", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Unique ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Unique ID No"
            onChangeText={(text) => handleChange("uniqueID", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Referred By:</Text>
          <TextInput
            style={styles.input}
            placeholder="Referred By"
            onChangeText={(text) => handleChange("referredBy", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Clinic Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Clinic Name"
            onChangeText={(text) => handleChange("clinicName", text)}
          />
        </View>
        {/* Other Details */}
        <Text style={styles.sectionHeader}>Other Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth:</Text>
          <TouchableOpacity
            onPress={() => handleChange("showDatePicker", true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text>
              {formData.dateOfBirth instanceof Date
                ? formData.dateOfBirth.toISOString().split("T")[0]
                : new Date(formData.dateOfBirth).toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>

          {formData.showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                handleChange("showDatePicker", false);
                if (event.type === "set" && selectedDate) {
                  const dob = new Date(selectedDate);
                  handleChange("dateOfBirth", dob);
                  handleChange("age", calculateAge(dob));
                }
              }}
            />
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Guardian Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Guardian Name"
            onChangeText={(text) => handleChange("guardianName", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient Occupation:</Text>
          <TextInput
            style={styles.input}
            placeholder="Patient Occupation"
            onChangeText={(text) => handleChange("occupation", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Income:</Text>
          <TextInput
            style={styles.input}
            placeholder="Annual Income"
            keyboardType="numeric"
            onChangeText={(text) => handleChange("income", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Home Phone:</Text>
          <TextInput
            style={styles.input}
            placeholder="Home Phone"
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("homePhone", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Home Address:</Text>
          <TextInput
            style={styles.input}
            placeholder="Home Address"
            onChangeText={(text) => handleChange("homeAddress", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>State:</Text>
          <TextInput
            style={styles.input}
            placeholder="State/Province/Governorate"
            onChangeText={(text) => handleChange("state", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Country:</Text>
          <TextInput
            style={styles.input}
            placeholder="Country"
            onChangeText={(text) => handleChange("country", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pin Code:</Text>
          <TextInput
            style={styles.input}
            placeholder="Pin Code/Zip Code"
            keyboardType="numeric"
            onChangeText={(text) => handleChange("zipCode", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>E-mail ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail ID"
            keyboardType="email-address"
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
        {/* Emergency Contact */}
        <Text style={styles.sectionHeader}>Emergency Contact</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={(text) => handleChange("emergencyName", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Relationship:</Text>
          <TextInput
            style={styles.input}
            placeholder="Relationship"
            onChangeText={(text) => handleChange("emergencyRelation", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("emergencyMobile", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Home Phone:</Text>
          <TextInput
            style={styles.input}
            placeholder="Home Phone"
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("emergencyPhone", text)}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btn1} onPress={handleSubmit}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={handleCancel}>
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "darkcyan",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  sectionHeader: {
    backgroundColor: "darkcyan",
    color: "white",
    fontSize: 18,
    padding: 8,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    width: 120,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  btn1: {
    backgroundColor: "darkcyan",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  btn2: {
    backgroundColor: "darkcyan",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default PatientRegistration;
