import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const PRODUCTS = [
  { key: "pinkgo", name: "Pink Go", eta: "4 min", capacity: "1–3 ppl", price: "₹178" },
  { key: "pinkprem", name: "Pink Exclusive", eta: "5 min", capacity: "1–3 ppl", price: "₹224" },
  { key: "pinkxl", name: "Pink XL", eta: "7 min", capacity: "1–5 ppl", price: "₹312" },
  { key: "auto", name: "Pink Auto", eta: "3 min", capacity: "1–2 ppl", price: "₹96" },
];

export default function ConfirmRide({ onConfirm: onConfirmProp = () => {} , onBack: onBackProp = null }) {
  const navigation = useNavigation();
  const route = useRoute();

  const {
    pickup = "PEC, Sector 12, Chandigarh",
    dropoff = "Choose destination",
    eta: initEta = "4 min",
    price: initPrice = "₹178",
    surge = false,
    payment = { brand: "Visa", last4: "4242" },
  } = route.params ?? {};

  // Selected product
  const [selectedKey, setSelectedKey] = useState("pinkgo");

  const selected = useMemo(
    () => PRODUCTS.find(p => p.key === selectedKey) || PRODUCTS[0],
    [selectedKey]
  );

  const onBack = onBackProp || (() => navigation.goBack());

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={onBack} style={[styles.circle, { marginRight: 8 }]} accessibilityRole="button">
          <Text style={styles.circleText}>‹</Text>
        </Pressable>
        <Text style={styles.title}>Confirm ride</Text>
        <Pressable style={[styles.circle, { marginLeft: "auto" }]} accessibilityRole="button">
          <Text style={styles.circleText}>?</Text>
        </Pressable>
      </View>

      {/* Map placeholder (swap with MapView for real map) */}
      <View style={styles.map}>
        <Image
          source={{ uri: "https://maps.gstatic.com/tactile/basepage/pegman_sherlock.png" }}
          style={{ width: 36, height: 36, opacity: 0.4 }}
          resizeMode="contain"
        />
        <Text style={styles.mapHint}>Map preview (plug your MapView here)</Text>
      </View>

      {/* Slide-up card */}
      <View style={styles.sheetShadow}>
        <View style={styles.sheet}>
          {/* Route summary */}
          <View style={styles.routeRow}>
            <View style={styles.pinCol}>
              <View style={[styles.pin, { backgroundColor: "#ec4899" }]} />
              <View style={styles.dotted} />
              <View style={[styles.pin, { backgroundColor: "#ef4444" }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text numberOfLines={1} style={styles.placeText}>{pickup}</Text>
              <Text numberOfLines={1} style={styles.placeText}>{dropoff}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.eta}>{selected?.eta || initEta}</Text>
              <Text style={styles.distance}>~ 2.4 km</Text>
            </View>
          </View>

          {/* Ride options as pressable buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 4 }}
            style={{ marginTop: 8 }}
          >
            {PRODUCTS.map((p) => {
              const isSel = p.key === selectedKey;
              return (
                <Pressable
                  key={p.key}
                  onPress={() => setSelectedKey(p.key)}
                  style={[styles.optionBtn, isSel && styles.optionBtnSelected]}
                >
                  <View style={styles.optionIcon}><Text style={{ fontSize: 18 }}>🚗</Text></View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionTitle, isSel && styles.optionTitleSel]}>{p.name}</Text>
                    <Text style={styles.optionSub}>{p.eta} • {p.capacity}</Text>
                  </View>
                  <Text style={[styles.optionPrice, isSel && styles.optionTitleSel]}>{p.price}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Fare line reflects selected option */}
          <View style={styles.rowBetween}>
            <Text style={styles.rowLabel}>Price estimate</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {surge && <Text style={styles.surge}>Surge</Text>}
              <Text style={styles.price}>{selected?.price || initPrice}</Text>
            </View>
          </View>

          {/* Payment */}
          <Pressable style={[styles.rowBetween, styles.touchRow]}>
            <Text style={styles.rowLabel}>Payment</Text>
            <Text style={styles.disc}>{payment.brand} •••• {payment.last4}</Text>
          </Pressable>

          {/* Safety */}
          <View style={[styles.safety, styles.rowBetween]}>
            <Text style={styles.safetyText}>Match car & number plate</Text>
            <Text style={styles.safetyIcon}>🛡️</Text>
          </View>

          {/* Confirm */}
          <Pressable
            style={styles.confirmBtn}
            accessibilityRole="button"
            onPress={() => onConfirmProp({ product: selected, pickup, dropoff })}
          >
            <Text style={styles.confirmText}>Confirm {selected?.name}</Text>
            <Text style={styles.confirmSub}>{selected?.eta || initEta} • {selected?.price || initPrice}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },

  /* Top */
  topBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  circle: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "#2a2a2a",
    alignItems: "center", justifyContent: "center", backgroundColor: "#141414",
  },
  circleText: { color: "#e8e8e8", fontSize: 20, lineHeight: 20, fontWeight: "600" },
  title: { color: "#e8e8e8", fontSize: 18, fontWeight: "700" },

  /* Map placeholder */
  map: {
    height: 280, marginHorizontal: 12, borderRadius: 16, overflow: "hidden",
    backgroundColor: "#111", borderWidth: 1, borderColor: "#1f1f1f",
    alignItems: "center", justifyContent: "center",
  },
  mapHint: { color: "#8a8a8a", marginTop: 8, fontSize: 12 },

  /* Sheet */
  sheetShadow: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#0e0e0e", borderTopLeftRadius: 22, borderTopRightRadius: 22,
    padding: 16, gap: 12, borderTopWidth: 1, borderColor: "#1b1b1b",
  },

  /* Route summary */
  routeRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  pinCol: { width: 14, alignItems: "center" },
  pin: { width: 10, height: 10, borderRadius: 6 },
  dotted: { width: 2, flex: 1, marginVertical: 4, backgroundColor: "#262626" },
  placeText: { color: "#e8e8e8", fontSize: 14, marginBottom: 4 },
  eta: { color: "#e8e8e8", fontWeight: "700" },
  distance: { color: "#a1a1a1", fontSize: 12 },

  /* Ride option buttons */
  optionBtn: {
    backgroundColor: "#121212",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#222",
    flexDirection: "row",
    alignItems: "center",
    minWidth: 220,
    marginRight: 10,
    gap: 10,
  },
  optionBtnSelected: { borderColor: "#ec4899", backgroundColor: "#1a0d14" },
  optionIcon: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: "#151515", alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#242424",
  },
  optionTitle: { color: "#e8e8e8", fontWeight: "700" },
  optionTitleSel: { color: "#ffd1ec" },
  optionSub: { color: "#9a9a9a", fontSize: 12 },
  optionPrice: { color: "#e8e8e8", fontWeight: "700", marginLeft: "auto" },

  /* Fare / Payment / Safety */
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 6 },
  rowLabel: { color: "#bcbcbc" },
  price: { color: "#e8e8e8", fontWeight: "700" },
  surge: { fontSize: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: "#2a120f", color: "#ffb4a6" },
  touchRow: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#1a1a1a", paddingVertical: 12 },
  disc: { color: "#e8e8e8", fontWeight: "600" },

  safety: {
    backgroundColor: "#0f1316", borderWidth: 1, borderColor: "#17212b",
    borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10,
  },
  safetyText: { color: "#cfe7ff", fontSize: 12, fontWeight: "600" },
  safetyIcon: { fontSize: 14, color: "#cfe7ff" },

  /* Confirm */
  confirmBtn: {
    backgroundColor: "#111827", borderColor: "#1f2a37", borderWidth: 1,
    borderRadius: 18, paddingVertical: 14, paddingHorizontal: 16,
    alignItems: "center", marginTop: 4,
  },
  confirmText: { color: "#e7f0ff", fontWeight: "800", fontSize: 16 },
  confirmSub: { color: "#b8d4ff", marginTop: 2 },
});