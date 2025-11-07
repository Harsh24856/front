// Components/PostDel.jsx
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBase } from "../lib/apiBase";
import { AuthContext } from "../App";

const API_BASE = getApiBase();

const toYMD = (d) => {
  if (!d || Number.isNaN(+d)) return "";
  return d.toISOString().split('T')[0];
};

export default function PostDel() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) navigation.replace("SignIn");
  }, [user, navigation]);

  const [formData, setFormData] = useState({
    mother_name: "", delivery_date: "", complications: "",
    child_weight: "", child_diseases: [], notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deliveryDateObj, setDeliveryDateObj] = useState(null);

  const handleChange = (name, value) => setFormData((p) => ({ ...p, [name]: value }));

  const handleNumberChange = (name, value) => {
    const cleaned = String(value).replace(/[^0-9.]/g, "");
    setFormData((p) => ({ ...p, [name]: cleaned }));
  };

  const validate = () => {
    const errors = [];
    if (!formData.mother_name.trim()) errors.push("Mother's name");
    if (!formData.delivery_date) errors.push("Delivery date");
    if (!formData.child_weight || Number(formData.child_weight) <= 0) {
      errors.push("Valid Child weight");
    }
    return errors;
  };

  const handleSubmit = async () => {
    const errors = validate();
    if (errors.length) {
      Alert.alert("Missing fields", "Please complete: " + errors.join(", "));
      return;
    }

    const payload = {
      mother_name: formData.mother_name.trim(),
      delivery_date: formData.delivery_date,
      complications: formData.complications.trim() || null,
      child_weight_kg: parseFloat(formData.child_weight),
      child_diseases: formData.child_diseases.map((s) => s.trim()).filter(Boolean),
      notes: formData.notes.trim() || null,
      submitted_at: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please sign in again.");
        navigation.replace("SignIn");
        return;
      }

      const res = await fetch(`${API_BASE}/post-delivery`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Submit failed", data.error || data.detail || `HTTP ${res.status}`);
        return;
      }

      if (data.record) {
        await AsyncStorage.setItem("lastPostDeliveryRecord", JSON.stringify(data.record));
      }
      navigation.navigate("PostDeliveryResult", { record: data.record });

    } catch (err) {
      console.error("Submission error:", err);
      Alert.alert("Server error", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      mother_name: "", delivery_date: "", complications: "",
      child_weight: "", child_diseases: [], notes: "",
    });
    setDeliveryDateObj(null);
  };

  if (!user) {
    return (
      <View style={styles.page}>
        <Text>Please sign in to continue.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post-Delivery Data</Text>
          <Text style={styles.headerSubtitle}>Enter details about the delivery outcome.</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.field}>
          <Text style={styles.label}>Mother's Name</Text>
          <TextInput value={formData.mother_name} onChangeText={(t) => handleChange("mother_name", t)} placeholder="Enter mother's full name" style={styles.input} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date of Delivery</Text>
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.inputShell}>
            <Text style={formData.delivery_date ? styles.inputText : styles.placeholder}>
              {formData.delivery_date || "Select date"}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              mode="date" display="default" value={deliveryDateObj || new Date()} maximumDate={new Date()}
              onChange={(event, selected) => {
                setShowDatePicker(false);
                if (selected) {
                  setDeliveryDateObj(selected);
                  handleChange("delivery_date", toYMD(selected));
                }
              }}
            />
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Complications During Delivery</Text>
          <TextInput value={formData.complications} onChangeText={(t) => handleChange("complications", t)} placeholder="Describe complications (if any)" style={[styles.input, styles.textarea]} multiline />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Child Weight at Birth (kg)</Text>
          <TextInput value={formData.child_weight} onChangeText={(t) => handleNumberChange("child_weight", t)} placeholder="e.g., 3.2" keyboardType="decimal-pad" style={styles.input} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Known Illnesses in Child</Text>
          <TextInput
            value={formData.child_diseases.join(", ")}
            onChangeText={(t) => setFormData((p) => ({ ...p, child_diseases: t.split(",") }))}
            placeholder="e.g., Jaundice, Heart condition" style={styles.input}
          />
          <Text style={styles.hint}>Separate multiple items with commas.</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput value={formData.notes} onChangeText={(t) => handleChange("notes", t)} placeholder="Optional notes about the mother or child" style={[styles.input, styles.textarea]} multiline />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable onPress={handleSubmit} disabled={submitting} style={[styles.submitBtn, submitting && styles.submitDisabled]}>
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Record</Text>}
          </Pressable>
          <Pressable onPress={resetForm} disabled={submitting} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* ---------- STYLES (shared with PrePeg) ---------- */
const styles = StyleSheet.create({
  page: { padding: 16, backgroundColor: "#f9fafb" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#f97316" }, // Orange accent
  headerSubtitle: { marginTop: 4, fontSize: 14, color: "#4b5563" },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: "#374151", marginBottom: 8, fontWeight: "600" },
  input: {
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fff",
  },
  inputShell: {
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 50,
    justifyContent: 'center',
  },
  inputText: { color: "#111827", fontSize: 15 },
  placeholder: { color: "#9ca3af", fontSize: 15 },
  textarea: { minHeight: 100, textAlignVertical: "top" },
  hint: { marginTop: 8, fontSize: 12, color: "#6b7280" },
  actions: { flexDirection: "row", gap: 12, marginTop: 6 },
  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f97316", // Orange accent
    elevation: 2,
  },
  submitDisabled: { backgroundColor: "#fdba74" },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  resetBtn: {
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  resetText: { color: "#374151", fontWeight: "600" },
});