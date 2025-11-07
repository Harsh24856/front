import React, { useMemo, useState } from "react";
import {
  View, Text, StyleSheet, TextInput, Pressable,
  KeyboardAvoidingView, Platform, FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Try to load react-native-maps (works in dev build; falls back in Expo Go)
let MapView, Marker;
try {
  const rnMaps = require("react-native-maps");
  MapView = rnMaps.default;
  Marker = rnMaps.Marker;
} catch {
  MapView = null;
  Marker = null;
}

const SUGGESTIONS = [
  { id: "1", title: "City Hospital", subtitle: "Sector 22, Chandigarh", lat: 30.732, lng: 76.773 },
  { id: "2", title: "PU South Campus", subtitle: "Sector 25", lat: 30.748, lng: 76.758 },
  { id: "3", title: "Cricket Stadium", subtitle: "Sector 16", lat: 30.748, lng: 76.79 },
];

export default function Search() {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const initialRegion = useMemo(() => ({
    latitude: 30.7333,
    longitude: 76.7794,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }), []);

  const data = query.trim()
    ? SUGGESTIONS.filter(
        x =>
          x.title.toLowerCase().includes(query.toLowerCase()) ||
          x.subtitle.toLowerCase().includes(query.toLowerCase())
      )
    : SUGGESTIONS;

  // ⬇️ IMPORTANT CHANGE: pass dropoff from selection, pickup fixed to PEC
  const goToConfirm = () => {
    if (!selected) return;
    navigation.navigate("ConfirmRide", {
      pickup: "PEC, Sector 12, Chandigarh",
      dropoff: `${selected.title}${selected.subtitle ? ", " + selected.subtitle : ""}`,
      eta: "4 min",
      price: "₹178",
      product: "PinkGo",
    });
  };

  return (
    <View style={styles.container}>
      {MapView ? (
        <MapView style={StyleSheet.absoluteFill} initialRegion={initialRegion} showsUserLocation>
          {selected && (
            <Marker
              coordinate={{ latitude: selected.lat, longitude: selected.lng }}
              title={selected.title}
              description={selected.subtitle}
            />
          )}
        </MapView>
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.mapFallback]}>
          <Text style={styles.fallbackTitle}>Map unavailable in Expo Go</Text>
          <Text style={styles.fallbackSub}>Use a dev build to enable react-native-maps.</Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
          <View style={styles.searchWrap}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Where to?"
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
              autoFocus
              returnKeyType="search"
            />
          </View>
          <Pressable style={styles.clearBtn} onPress={() => setQuery("")}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
                onPress={() => setSelected(item)}
              >
                <View style={styles.pin}><Text>📍</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.subtitle}>{item.subtitle}</Text>
                </View>
                <Text style={styles.chev}>›</Text>
              </Pressable>
            )}
            ListFooterComponent={
              <Pressable
                style={[styles.primaryCTA, !selected && styles.primaryCTADisabled]}
                onPress={goToConfirm}
                disabled={!selected}
              >
                <Text style={styles.primaryCTAText}>
                  {selected ? "Confirm destination" : "Select a destination"}
                </Text>
              </Pressable>
            }
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  overlay: { flex: 1, paddingTop: Platform.select({ ios: 14, android: 10 }) },

  // Top bar
  topBar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "#141414", alignItems: "center", justifyContent: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "#2a2a2a" },
  backText: { fontSize: 20, fontWeight: "800", color: "#e5e7eb" },
  searchWrap: { flex: 1, backgroundColor: "#0f0f0f", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: "#1f1f1f" },
  searchInput: { color: "#e5e7eb", fontWeight: "600" },
  clearBtn: { paddingHorizontal: 6, paddingVertical: 8 },
  clearText: { color: "#ffd1ec", fontWeight: "700" },

  // Results card
  card: { marginTop: 10, marginHorizontal: 12, backgroundColor: "#0e0e0e", borderRadius: 16, maxHeight: "60%", paddingVertical: 6, paddingHorizontal: 8, borderWidth: 1, borderColor: "#1b1b1b" },
  sep: { height: 1, backgroundColor: "#1f2937" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 10 },
  pin: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#1a0d14", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#301625" },
  title: { fontWeight: "700", color: "#e5e7eb" },
  subtitle: { color: "#9ca3af", fontSize: 12 },
  chev: { color: "#e5e7eb", fontSize: 18 },

  // Primary CTA reflects PinkGo brand
  primaryCTA: { backgroundColor: "#ec4899", borderRadius: 12, alignItems: "center", paddingVertical: 12, marginTop: 10, marginBottom: 6 },
  primaryCTAText: { color: "#0b0b0b", fontWeight: "900" },
  primaryCTADisabled: { opacity: 0.5 },

  // Map fallback when react-native-maps isn't available
  mapFallback: { alignItems: "center", justifyContent: "center", backgroundColor: "#111827" },
  fallbackTitle: { color: "#e5e7eb", fontWeight: "800", fontSize: 16 },
  fallbackSub: { color: "#9ca3af", marginTop: 6 },
});