import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApiBase } from "../lib/apiBase";
const API_BASE = getApiBase();
const API_URL = `${API_BASE}/maternal-health`;

/* -------------------- MultiSelectDropdown (RN) -------------------- */
function MultiSelectDropdown({ options, value = [], onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  const toggleOption = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else {
      if (opt === "None") onChange(["None"]);
      else onChange([...value.filter((v) => v !== "None"), opt]);
    }
  };

  const clearAll = () => onChange([]);

  return (
    <View>
      <Pressable style={styles.inputShell} onPress={() => setOpen(true)}>
        {value.length === 0 ? (
          <Text style={styles.placeholder}>{placeholder}</Text>
        ) : (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {value.map((v) => (
              <View key={v} style={styles.chip}>
                <Text style={styles.chipText}>{v}</Text>
              </View>
            ))}
          </View>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPressOut={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select options</Text>
            <ScrollView style={{ maxHeight: 260 }}>
              {options.map((opt) => {
                const checked = value.includes(opt);
                return (
                  <Pressable
                    key={opt}
                    onPress={() => toggleOption(opt)}
                    style={styles.optionRow}
                  >
                    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                      {checked && <Text style={styles.checkboxTick}>✓</Text>}
                    </View>
                    <Text style={styles.optionText}>{opt}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable style={styles.btnSecondary} onPress={clearAll}>
                <Text style={styles.btnSecondaryText}>Clear</Text>
              </Pressable>
              <Pressable style={styles.btnPrimary} onPress={() => setOpen(false)}>
                <Text style={styles.btnPrimaryText}>Done</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* -------------------- SingleSelect (RN) -------------------- */
function SingleSelect({ options, value, onChange, placeholder = "Select" }) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable style={styles.inputShell} onPress={() => setOpen(true)}>
        {value ? (
          <Text style={styles.inputText}>{value}</Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalOverlay}
          onPressOut={() => setOpen(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <ScrollView style={{ maxHeight: 260 }}>
              {options.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => {
                    onChange(opt);
                    setOpen(false);
                  }}
                  style={styles.optionRow}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      value === opt && { borderColor: "#16a34a" },
                    ]}
                  >
                    {value === opt && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionText}>{opt}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <View style={styles.modalActions}>
              <Pressable style={styles.btnSecondary} onPress={() => setOpen(false)}>
                <Text style={styles.btnSecondaryText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

/* -------------------- Main PrePeg screen (RN) -------------------- */
export default function PrePeg() {
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    past_pregnancy_count: "",
    blood_group_mother: "",
    blood_group_father: "",
    medical_bg_mother: [],
    medical_bg_father: [],
    years_since_last_pregnancy: "",
    delivery_type: "",
    haemoglobin: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const medicalOptions = [
    "None", "Diabetes", "Hypertension", "Thyroid Disorder", "Anaemia",
    "Heart Disease", "Kidney Disease", "Epilepsy", "Asthma",
    "Genetic Disorder", "Mental Health", "Other",
  ];

  const handleChange = (name, value) => setFormData((p) => ({ ...p, [name]: value }));

  const handleNumberChange = (name, raw) => {
    const cleaned = String(raw).replace(name === "haemoglobin" ? /[^0-9.]/g : /\D/g, "");
    setFormData((p) => ({ ...p, [name]: cleaned }));
  };
  
  const setMulti = (name, arr) => {
    const cleaned = arr.includes("None") && arr.length > 1 ? arr.filter((a) => a !== "None") : arr;
    setFormData((p) => ({ ...p, [name]: cleaned }));
  };

  const validate = () => {
    return Object.keys(formData).filter((k) => {
      const v = formData[k];
      return Array.isArray(v) ? v.length === 0 : !String(v || "").trim();
    });
  };

  const handleSubmit = async () => {
    const missing = validate();
    if (missing.length) {
      Alert.alert("Missing fields", `Please complete: ${missing.join(", ")}`);
      return;
    }

    const payload = {
      ...formData,
      age: Number(formData.age),
      past_pregnancy_count: Number(formData.past_pregnancy_count),
      years_since_last_pregnancy: Number(formData.years_since_last_pregnancy),
      haemoglobin: parseFloat(formData.haemoglobin),
      medical_bg_mother: formData.medical_bg_mother.join(","),
      medical_bg_father: formData.medical_bg_father.join(","),
    };

    try {
      setSubmitting(true);
      const token = (await AsyncStorage.getItem("token")) || "";

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const resp = await res.json();

      if (!res.ok) {
        Alert.alert("Failed to submit", resp.error || "Unknown error");
        return;
      }

      await AsyncStorage.setItem("lastPredictionResponse", JSON.stringify(resp));
      navigation.navigate("PrePegOp", { payload: resp });

    } catch (err) {
      console.error("Error submitting form:", err);
      Alert.alert("Server error", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () =>
    setFormData({
      name: "", age: "", past_pregnancy_count: "", blood_group_mother: "",
      blood_group_father: "", medical_bg_mother: [], medical_bg_father: [],
      years_since_last_pregnancy: "", delivery_type: "", haemoglobin: "",
    });

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pre-Delivery Screening</Text>
          <Text style={styles.headerSubtitle}>Fill in the patient's details carefully.</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.field}>
          <Text style={styles.label}>Patient's Name</Text>
          <TextInput value={formData.name} onChangeText={(t) => handleChange("name", t)} style={styles.input} placeholder="Enter full name" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <TextInput value={formData.age} onChangeText={(t) => handleNumberChange("age", t)} style={styles.input} keyboardType="number-pad" placeholder="e.g., 28" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Past Pregnancy Count</Text>
          <TextInput value={formData.past_pregnancy_count} onChangeText={(t) => handleNumberChange("past_pregnancy_count", t)} style={styles.input} keyboardType="number-pad" placeholder="e.g., 1" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Blood Group (Mother)</Text>
          <SingleSelect options={bloodGroups} value={formData.blood_group_mother} onChange={(v) => handleChange("blood_group_mother", v)} placeholder="Select blood group" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Blood Group (Father)</Text>
          <SingleSelect options={bloodGroups} value={formData.blood_group_father} onChange={(v) => handleChange("blood_group_father", v)} placeholder="Select blood group" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Medical History (Mother)</Text>
          <MultiSelectDropdown options={medicalOptions} value={formData.medical_bg_mother} onChange={(a) => setMulti("medical_bg_mother", a)} placeholder="Select conditions" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Medical History (Father)</Text>
          <MultiSelectDropdown options={medicalOptions} value={formData.medical_bg_father} onChange={(a) => setMulti("medical_bg_father", a)} placeholder="Select conditions" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Years Since Last Pregnancy</Text>
          <TextInput value={formData.years_since_last_pregnancy} onChangeText={(t) => handleNumberChange("years_since_last_pregnancy", t)} style={styles.input} keyboardType="number-pad" placeholder="e.g., 2" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Previous Delivery Type</Text>
          <SingleSelect options={["Normal", "C-Section", "Other"]} value={formData.delivery_type} onChange={(v) => handleChange("delivery_type", v)} placeholder="Select type" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Haemoglobin (g/dL)</Text>
          <TextInput value={formData.haemoglobin} onChangeText={(t) => handleNumberChange("haemoglobin", t)} style={styles.input} keyboardType="decimal-pad" placeholder="e.g., 12.0" />
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <Pressable onPress={handleSubmit} disabled={submitting} style={[styles.submitBtn, submitting && styles.submitDisabled]}>
            <Text style={styles.submitText}>{submitting ? "Submitting..." : "Submit & Analyze"}</Text>
          </Pressable>
          <Pressable onPress={resetForm} disabled={submitting} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

/* -------------------- Styles -------------------- */
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
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#16a34a" },
  headerSubtitle: { marginTop: 4, fontSize: 14, color: "#4b5563" },
  field: { marginBottom: 16 },
  label: { fontSize: 14, color: "#374151", marginBottom: 8, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
  inputShell: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#f9fafb",
    minHeight: 50,
    justifyContent: 'center',
  },
  inputText: { color: "#111827", fontSize: 15 },
  placeholder: { color: "#9ca3af", fontSize: 15 },
  actionsRow: { flexDirection: "row", gap: 12, marginTop: 12 },

  submitBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16a34a",
    elevation: 2,
  },
  submitDisabled: { backgroundColor: "#a3e6b8" },
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

  // modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  modalTitle: { fontWeight: "700", fontSize: 18, marginBottom: 12, color: "#111827" },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6",
  },
  optionText: { color: "#374151", fontSize: 15 },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, paddingTop: 16 },

  btnPrimary: { backgroundColor: "#16a34a", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnPrimaryText: { color: "#fff", fontWeight: "600" },
  btnSecondary: { backgroundColor: "#f3f4f6", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnSecondaryText: { color: "#374151", fontWeight: "600" },

  // chips
  chip: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: "#166534", fontSize: 13, fontWeight: "600" },

  // checkbox
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  checkboxTick: { color: "#fff", fontSize: 12, fontWeight: "900" },

  // radio
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#9ca3af",
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#16a34a" },
});