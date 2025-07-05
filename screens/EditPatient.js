import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import TopBar from "../components/TopBar";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "react-native-paper";
import axios from "axios";
import { getPatientById, updatePatient } from "../services/patientService";

const EditPatient = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { patientId } = route.params; // route param passed from PatientsPage

  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    sex: "Male",
    // all other fields ...
    dateOfBirth: new Date(),
    showDatePicker: false,
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const data = await getPatientById(patientId); // Load data from Laravel
        setFormData((prev) => ({
          ...prev,
          ...data,
          dateOfBirth: new Date(data.birth_date),
          photo: data.photo
            ? {
                uri: `https://192.168.0.243/storage/${data.photo}`,
              }
            : null,
        }));
      } catch (error) {
        console.error("Failed to load patient:", error);
      }
    };

    fetchPatient();
  }, [patientId]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImagePick = async () => {
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
  const handleSubmit = async () => {
    const payload = new FormData();
    payload.append("patient_name", formData.patient_name);
    payload.append("sex", formData.sex);
    payload.append("mobile", formData.mobile);
    payload.append("age", formData.age);
    payload.append("spouse_name", formData.spouse_name);
    payload.append("parent_name", formData.parent_name);
    payload.append("guardian_name", formData.guardian_name);
    payload.append("occupation", formData.occupation);
    payload.append("annual_income", formData.annual_income);
    payload.append("marrital_status", formData.marrital_status);
    payload.append("confidential", formData.confidential ? 1 : 0);
    payload.append("referral_id", formData.referral_id);
    payload.append("clinic", formData.clinic);
    payload.append("city", formData.city);
    payload.append("email", formData.email);
    payload.append("aadhaar_no", formData.aadhaar_no);
    payload.append(
      "birth_date",
      formData.dateOfBirth.toISOString().split("T")[0]
    );
    if (formData.photo?.uri && !formData.photo.uri.startsWith("http")) {
      payload.append("photo", formData.photo);
    }

    try {
      await updatePatient(patientId, payload);
      alert(" Patient updated!");
      navigation.goBack();
    } catch (error) {
      console.error(" Failed to update:", error);
      alert("Update failed");
    }
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age.toString();
  };

  return (
    <ScrollView style={styles.container}>
      <TopBar title="Edit Patient" navigation={navigation} />
      <View style={{ padding: 16 }}>
        {/* Photo */}
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          {formData.photo?.uri ? (
            <Image source={{ uri: formData.photo.uri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>No Image</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.imageButton}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              Change Photo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Example fields */}
        <View style={styles.row}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.patient_name}
            onChangeText={(text) => handleChange("patient_name", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Sex:</Text>
          <View style={{ flexDirection: "row" }}>
            {["Male", "Female"].map((val) => (
              <View
                key={val}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <RadioButton
                  value={val}
                  status={formData.sex === val ? "checked" : "unchecked"}
                  onPress={() => handleChange("sex", val)}
                />
                <Text>{val}</Text>
              </View>
            ))}
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
            value={formData.spouse_name}
            placeholder="Spouse Name"
            onChangeText={(text) => handleChange("spouse_name", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Father Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.parent_name}
            placeholder="Father/Mother Name"
            onChangeText={(text) => handleChange("parent_name", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <TextInput
            style={styles.input}
            value={formData.city}
            placeholder="Location/City"
            onChangeText={(text) => handleChange("city", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Mobile:</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile"
            value={formData.mobile}
            keyboardType="phone-pad"
            onChangeText={(text) => handleChange("mobile", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>skypeID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Skype ID"
            value={formData.skypeID}
            onChangeText={(text) => handleChange("skypeID", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Unique ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Unique ID No"
            value={formData.aadhaar_no}
            onChangeText={(text) => handleChange("aadhaar_no", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Referred By:</Text>
          <TextInput
            style={styles.input}
            value={formData.referral_id}
            placeholder="Referred By"
            onChangeText={(text) => handleChange("referral_id", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Clinic Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.clinic}
            placeholder="Clinic Name"
            onChangeText={(text) => handleChange("clinic", text)}
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
                : ""}
            </Text>
          </TouchableOpacity>
          {formData.showDatePicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                handleChange("showDatePicker", false);
                if (event.type === "set") {
                  handleChange("dateOfBirth", selectedDate);
                  handleChange("age", calculateAge(selectedDate));
                }
              }}
            />
          )}
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Guardian Name:</Text>
          <TextInput
            style={styles.input}
            value={formData.guardian_name}
            placeholder="Guardian Name"
            onChangeText={(text) => handleChange("guardian_name", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Patient Occupation:</Text>
          <TextInput
            style={styles.input}
            value={formData.occupation}
            placeholder="Patient Occupation"
            onChangeText={(text) => handleChange("occupation", text)}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Annual Income:</Text>
          <TextInput
            style={styles.input}
            value={formData.annual_income}
            placeholder="Annual Income"
            keyboardType="numeric"
            onChangeText={(text) => handleChange("annual_income", text)}
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
            value={formData.guardian_name}
            placeholder="Name"
            onChangeText={(text) => handleChange("guardian_name", text)}
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
        {/* Submit */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.btn1} onPress={handleSubmit}>
            <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn2}
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
  container: { backgroundColor: "#f5f5f5", flex: 1 },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#fff",
    backgroundColor: "darkcyan",
    padding: 12,
    borderRadius: 8,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  label: { width: 120, fontWeight: "bold" },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  btn1: {
    backgroundColor: "darkcyan",
    padding: 12,
    borderRadius: 8,
  },
  btn2: {
    backgroundColor: "gray",
    padding: 12,
    borderRadius: 8,
  },
  btnText: { color: "white", fontWeight: "bold" },
  image: { width: 120, height: 120, borderRadius: 60 },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  imageButton: {
    marginTop: 10,
    backgroundColor: "darkcyan",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
});

export default EditPatient;
