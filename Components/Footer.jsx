import React from "react";
import { View, Text, StyleSheet, Pressable, Linking } from "react-native";

export default function Footer({ navigation }) {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.footer}>
      {/* Brand Logo + Name */}
      <View style={styles.brandRow}>
        <Text style={styles.logo}>🚖</Text>
        <Text style={styles.brandText}>PinkTaxi</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Safe. Stylish. Empowering rides for everyone 💗
      </Text>

      {/* Quick Links */}
      <View style={styles.linksRow}>
        <TextButton label="Home" onPress={() => navigation?.navigate("Role")} />
        <TextButton
          label="Services"
          onPress={() => navigation?.navigate("VehicleOptions")}
        />
        <TextButton
          label="Support"
          onPress={() => Linking.openURL("mailto:support@pinktaxi.app")}
        />
        <TextButton
          label="Terms"
          onPress={() => Linking.openURL("https://pinktaxi.app/terms")}
        />
      </View>

      {/* Copyright */}
      <Text style={styles.copy}>© {currentYear} PinkTaxi. All rights reserved.</Text>
    </View>
  );
}

/* ---------------- Helper Component ---------------- */
function TextButton({ label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 0.7 }}
    >
      <Text style={styles.linkText}>{label}</Text>
    </Pressable>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#e775a4ff", // Pink primary color
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  logo: {
    fontSize: 22,
  },
  brandText: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.5,
  },
  tagline: {
    color: "#fbcfe8",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 18,
  },
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 14,
    marginBottom: 10,
  },
  linkText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13.5,
    letterSpacing: 0.2,
    textDecorationLine: "underline",
  },
  copy: {
    color: "#f9a8d4",
    fontSize: 12,
    textAlign: "center",
    marginTop: 4,
  },
});