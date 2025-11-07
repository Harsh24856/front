import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function VehicleOptions() {
  return (
    <View style={styles.center}>
      <Text>Vehicle Options Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});