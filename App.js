// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";

import DashboardScreen from "./screens/DashboardScreen";
import PatientsPage from "./screens/PatientsPage";
import PatientRegistration from "./screens/AddPatientScreen";
import EditPatient from "./screens/EditPatient";
import PatientAppointment from "./screens/PatientAppointment";
import AppointmentPatientList from "./screens/AppointmentPatientList";
import BookedPatients from "./screens/BookedPatients";
import BasicHealthParameter from "./screens/BasicHealthParameter";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 25 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="PatientsPage" component={PatientsPage} />
          <Stack.Screen name="AddPatient" component={PatientRegistration} />
          <Stack.Screen name="EditPatient" component={EditPatient} />
          <Stack.Screen
            name="PatientAppointmentList"
            component={AppointmentPatientList}
          />
          <Stack.Screen
            name="PatientAppointment"
            component={PatientAppointment}
          />
          <Stack.Screen name="BookedPatients" component={BookedPatients} />
          <Stack.Screen
            name="BasicHealthParameter"
            component={BasicHealthParameter}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
