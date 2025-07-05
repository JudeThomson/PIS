// components/TopBar.js
import React from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const TopBar = ({ title, onRefresh }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.topBar}>
      <View style={styles.topLeft}>
        <Icon name="person-circle-outline" size={28} color="#fff" />
        <Text style={styles.topTitle}>{title}</Text>
      </View>
      <View style={styles.topRight}>
        <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
          <Icon
            name="home-outline"
            size={24}
            color="#fff"
            style={styles.iconBtn}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRefresh}>
          <Icon
            name="refresh-outline"
            size={24}
            color="#fff"
            style={styles.iconBtn}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert("Logging out...")}>
          <Icon
            name="power-outline"
            size={24}
            color="#fff"
            style={styles.iconBtn}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TopBar;
