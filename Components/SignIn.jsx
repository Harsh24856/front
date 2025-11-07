import React, { useEffect, useState } from "react";
import { getApiBase } from "../lib/apiBase";
const API_BASE = getApiBase();

import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignIn({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Using API_BASE:", API_BASE);
    let cancelled = false;
    fetch(`${API_BASE}/`)
      .then((r) => r.json())
      .then((j) => !cancelled && console.log("Ping OK:", j))
      .catch((e) => !cancelled && console.log("Ping FAIL:", e));
    return () => (cancelled = true);
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch (_) {}

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }

      navigation.replace("Home");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to PinkTaxi</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              placeholderTextColor="#9b9b9b"
              style={styles.input}
            />
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#9b9b9b"
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Sign In button */}
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={[
              styles.submit,
              loading ? styles.submitDisabled : styles.submitEnabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Sign in</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          New to PinkTaxi?{" "}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("SignUp")}
          >
            Create Account
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

/* 🌙 PinkTaxi Dark Theme */
const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#0b0b0b",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#111",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#e75abfff",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    color: "#dc57bdff",
    letterSpacing: 0.6,
  },
  subtitle: {
    textAlign: "center",
    color: "#b3b3b3",
    marginBottom: 12,
    fontSize: 14,
  },
  form: { marginTop: 16, gap: 18 },
  field: { gap: 8, marginBottom: 4 },
  label: {
    fontSize: 15,
    color: "#e5e5e5",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 16,
    backgroundColor: "#1a1a1a",
  },
  error: {
    color: "#f87171",
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  submit: {
    marginTop: 10,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  submitEnabled: {
    backgroundColor: "#da59baff",
    shadowColor: "#de52cbff",
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
  submitDisabled: {
    backgroundColor: "#a855f7",
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "#b3b3b3",
    fontSize: 15,
  },
  link: {
    color: "#ea5dccff",
    fontWeight: "700",
  },
});