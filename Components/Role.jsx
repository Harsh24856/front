import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Footer from "./Footer";

let MapView;
try {
  const rnMaps = require("react-native-maps");
  MapView = rnMaps.default;
} catch {
  MapView = null;
}

export default function Role() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const isCompact = width <= 375;
  const pad = isCompact ? 14 : 18;
  const gap = isCompact ? 10 : 12;
  const card = { borderRadius: 16, padding: pad };

  const initialRegion = useMemo(
    () => ({
      latitude: 30.7333,
      longitude: 76.7794,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }),
    []
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={[styles.topBar, { paddingHorizontal: pad }]}>
          <View style={styles.topLeft}>
            <Image source={require("../public/1.png")} style={styles.logo} />
            <Text style={styles.brand}>PinkTaxi</Text>
          </View>
          <View style={styles.topRight}>
            <Pressable style={styles.circleBtn}>
              <Text>💳</Text>
            </Pressable>
           <Pressable
            onPress={() => navigation.navigate("SignIn")}
            style={({ pressed }) => [
              styles.whereTo,
              pressed && { opacity: 0.85 },
            ]}></Pressable>
          </View>
        </View>

        {/* Where to? */}
        <View style={{ paddingHorizontal: pad, marginTop: 6 }}>
          <Pressable
            onPress={() => navigation.navigate("Search")}
            style={({ pressed }) => [
              styles.whereTo,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.whereToText}>Where to?</Text>
            <View style={styles.nowPill}>
              <Text style={styles.nowText}>Now ▾</Text>
            </View>
          </Pressable>
        </View>

        {/* Map preview */}
        <View style={[styles.mapCard, { marginHorizontal: pad, marginTop: gap }]}>
          <Text style={{ color: "#ec4899", fontWeight: "700" }}>Map</Text>
          <View style={styles.mapBox}>
            {MapView ? (
              <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={initialRegion}
                showsUserLocation
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.mapFallback]}>
                <Text style={styles.fallbackTitle}>Map unavailable in Expo Go</Text>
                <Text style={styles.fallbackSub}>
                  Use a dev build to enable react-native-maps.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.pickupRow}>
            <View style={styles.dot} />
            <Text style={styles.pickupText}>Current location</Text>
            <Pressable
              style={styles.editBtn}
              onPress={() => navigation.navigate("Search")}
            >
              <Text style={{ fontWeight: "700", color: "#ec4899" }}>Edit</Text>
            </Pressable>
          </View>

          <Pressable
            style={styles.primaryCTA}
            onPress={() =>
              navigation.navigate("ConfirmRide", {
                pickup: "PEC Chandigarh",
                dropoff: "Select destination",
              })
            }
          >
            <Text style={styles.primaryCTAText}>Set pickup</Text>
          </Pressable>
        </View>

        {/* Services */}
        <View style={{ marginTop: gap }}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: pad }]}>
            Services
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap,
              paddingHorizontal: pad,
              paddingVertical: 8,
            }}
          >
            <ServiceCard
              title="Pink Go"
              emoji="🚗"
              desc="Affordable rides"
              onPress={() => navigation.navigate("Search")}
            />
            <ServiceCard
              title="Pink Auto"
              emoji="🛺"
              desc="Auto rickshaw"
              onPress={() => navigation.navigate("Search")}
            />
            <ServiceCard
              title="Delivery"
              emoji="📦"
              desc="Send packages"
              onPress={() => navigation.navigate("Search")}
            />
            <ServiceCard
              title="Scheduled"
              emoji="🕒"
              desc="Book later"
              onPress={() => navigation.navigate("Search")}
            />
            <ServiceCard
              title="Intercity"
              emoji="🛣️"
              desc="Outstation rides"
              onPress={() => navigation.navigate("Search")}
            />
          </ScrollView>
        </View>

        {/* Recents */}
        <View style={{ paddingHorizontal: pad, marginTop: gap }}>
          <Text style={styles.sectionTitle}>Recent</Text>
          <RecentRow
            icon="🏥"
            title="City Hospital"
            subtitle="Sector 22, Chandigarh"
          />
          <RecentRow icon="🎓" title="PU South Campus" subtitle="Sector 25" />
          <RecentRow icon="🏟️" title="Cricket Stadium" subtitle="Sector 16" />
        </View>

        {/* Eats */}
        <View
          style={{
            paddingHorizontal: pad,
            marginTop: gap,
            marginBottom: pad * 1.2,
          }}
        >
          <View style={[styles.eatsBanner, card]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Order with PinkEats</Text>
              <Text style={styles.bannerSub}>
                From your favourite restaurants
              </Text>
              <Pressable style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Browse restaurants</Text>
              </Pressable>
            </View>
            <Text style={{ fontSize: 38, marginLeft: 8 }}>🍰</Text>
          </View>
        </View>

        <Footer navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ServiceCard({ title, emoji, desc, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.serviceCard,
        pressed && { opacity: 0.85, shadowOpacity: 0.8 },
      ]}
    >
      <View style={styles.serviceIcon}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <Text style={styles.serviceTitle}>{title}</Text>
      <Text style={styles.serviceDesc}>{desc}</Text>
    </Pressable>
  );
}

function RecentRow({ icon, title, subtitle }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.recentRow, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.recentIcon}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.recentTitle}>{title}</Text>
        <Text style={styles.recentSub}>{subtitle}</Text>
      </View>
      <Text style={{ color: "#ec4899" }}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0b0b0b" },
  topBar: {
    height: 48,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  brand: { fontSize: 22, fontWeight: "800", color: "#ec4899", letterSpacing: 0.5 },
  topRight: { flexDirection: "row", gap: 10 },
  circleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a1a1a",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },

  logo: {
    width: 36,
    height: 36,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    resizeMode: "contain",
    shadowColor: "#ec4899",
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },

  whereTo: {
    backgroundColor: "#1a1a1a",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: "#ec4899",
    borderWidth: 1,
    shadowColor: "#ec4899",
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  whereToText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  nowPill: {
    backgroundColor: "#0b0b0b",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: "#ec4899",
    borderWidth: 1,
  },
  nowText: { fontWeight: "700", color: "#ec4899" },

  mapCard: {
    backgroundColor: "#111",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1f1f1f",
    shadowColor: "#ec4899",
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  mapBox: {
    height: 150,
    backgroundColor: "#0f0f0f",
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    overflow: "hidden",
  },
  mapFallback: { alignItems: "center", justifyContent: "center" },
  fallbackTitle: { color: "#ec4899", fontWeight: "700", fontSize: 14 },
  fallbackSub: { color: "#ec4899", opacity: 0.7, marginTop: 4 },

  pickupRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#ec4899" },
  pickupText: { color: "#fff", fontWeight: "600", flex: 1 },
  editBtn: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ec4899",
  },

  primaryCTA: {
    backgroundColor: "#ec4899",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 12,
    shadowColor: "#ec4899",
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  primaryCTAText: { color: "#fff", fontWeight: "800" },

  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#fff" },

  serviceCard: {
    width: 140,
    backgroundColor: "#141414",
    borderRadius: 16,
    padding: 12,
    borderColor: "#ec4899",
    borderWidth: 0.5,
    shadowColor: "#ec4899",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  serviceTitle: { fontWeight: "800", color: "#fff" },
  serviceDesc: { color: "#ec4899", marginTop: 2, fontSize: 12 },

  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#222",
  },
  recentIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#1a1a1a",
    alignItems: "center",
    justifyContent: "center",
  },
  recentTitle: { fontWeight: "700", color: "#fff" },
  recentSub: { color: "#a1a1a1", fontSize: 12 },

  eatsBanner: {
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 18,
    shadowColor: "#ec4899",
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  bannerTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
  bannerSub: { color: "#e269a5ff", marginTop: 4 },
  bannerBtn: {
    backgroundColor: "#e668a7ff",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 10,
  },
  bannerBtnText: { color: "#fff", fontWeight: "800" },
});