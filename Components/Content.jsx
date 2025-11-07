import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  findNodeHandle,
  UIManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Content() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  // iPhone 16 family–tuned breakpoints
  const isCompact = width <= 392;              // very narrow
  const isRegular = width > 392 && width < 430; // 16 / 16 Pro
  const isPlus = width >= 430;                 // 16 Plus / Pro Max

  // Scales
  const padX = isCompact ? 18 : 24;
  const padY = isCompact ? 20 : 28; // keep vertical rhythm; hero top will be 0
  const heroTitleSize = isCompact ? 32 : isRegular ? 36 : 40;
  const heroLineHeight = heroTitleSize + 8;
  const heroSubSize = isCompact ? 15 : 16;
  const sectionTitleSize = isCompact ? 26 : isRegular ? 28 : 30;
  const sectionSubSize = isCompact ? 15 : 16;

  // Stats grid: 2-up on compact/regular, 4-up on plus (pro max)
  const statBasis = isPlus ? "23.5%" : "47%";

  // Smooth scroll plumbing
  const scrollRef = useRef(null);
  const footerRef = useRef(null);

  const scrollToFooter = () => {
    if (!footerRef.current || !scrollRef.current) return;
    const handle = findNodeHandle(footerRef.current);
    const scrollHandle = findNodeHandle(scrollRef.current);
    if (!handle || !scrollHandle) return;

    UIManager.measureLayout(
      handle,
      scrollHandle,
      () => {},
      (_x, y) => scrollRef.current.scrollTo({ y, animated: true })
    );
  };

  const cards = [
    {
      key: "risk",
      bgStyle: styles.cardGreen,
      dotStyle: styles.iconDotGreen,
      icon: "✓",
      title: "Risk Assessment",
      text:
        "AI-powered analysis to identify potential health risks during pregnancy and post-delivery",
    },
    {
      key: "tracking",
      bgStyle: styles.cardOrange,
      dotStyle: styles.iconDotOrange,
      icon: "📊",
      title: "Health Tracking",
      text: "Comprehensive monitoring of maternal health metrics and vital signs",
    },
    {
      key: "guidance",
      bgStyle: styles.cardMix,
      dotStyle: styles.iconDotMix,
      icon: "📘",
      title: "Expert Guidance",
      text:
        "Access to field guides and expert recommendations for optimal maternal care",
    },
  ];

  return (
    // Exclude "top" so header/navbar controls top inset; hero will touch navbar
    <SafeAreaView edges={["left", "right"]} style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.page}>
        {/* Hero */}
        <View
          style={[
            styles.heroWrap,
            {
              paddingHorizontal: padX,
              paddingTop: 0,               // touch the navbar
              paddingBottom: padY,
            },
          ]}
        >
          <View style={styles.heroInner}>
            <Text style={[styles.heroTitle, { fontSize: heroTitleSize, lineHeight: heroLineHeight }]}>
              Empowering{"\n"}
              <Text style={styles.heroGradientWord}>Maternal Health</Text>
            </Text>

            <Text style={[styles.heroSub, { fontSize: heroSubSize }]}>
              Your comprehensive digital companion for pregnancy tracking, risk
              assessment, and post-delivery care with AI-powered insights.
            </Text>

            <View style={styles.ctaRow}>
              <Pressable
                onPress={scrollToFooter}
                style={[
                  styles.primaryBtn,
                  {
                    paddingVertical: isCompact ? 12 : 14,
                    paddingHorizontal: isCompact ? 20 : 24,
                  },
                ]}
              >
                <Text style={[styles.primaryBtnText, { fontSize: isCompact ? 15 : 16 }]}>Get Started</Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("FieldGuide")}
                style={[
                  styles.secondaryBtn,
                  {
                    paddingVertical: isCompact ? 12 : 14,
                    paddingHorizontal: isCompact ? 20 : 24,
                  },
                ]}
              >
                <Text style={[styles.secondaryBtnText, { fontSize: isCompact ? 15 : 16 }]}>Learn More</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={[styles.featuresSection, { paddingHorizontal: padX, paddingVertical: padY }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: sectionTitleSize }]}>Why Choose मातृCare?</Text>
            <Text style={[styles.sectionSub, { fontSize: sectionSubSize }]}>
              Comprehensive maternal health solutions powered by advanced technology
            </Text>
          </View>

          {/* 2 cards in the first row, 1 full-width below */}
          <View style={[styles.cardsGrid, { gap: 12 }]}>
            {cards.map((c, idx) => {
              const basis = idx < 2 ? "48%" : "100%"; // first two: half width, last: full width
              return (
                <View key={c.key} style={[styles.card, c.bgStyle, { flexBasis: basis }]}>
                  <View style={[styles.iconDot, c.dotStyle]}>
                    <Text style={idx === 0 ? styles.iconTick : styles.iconBook}>{c.icon}</Text>
                  </View>
                  <Text style={[styles.cardTitle, { fontSize: isCompact ? 18 : 20 }]}>{c.title}</Text>
                  <Text style={[styles.cardText, { fontSize: isCompact ? 14 : 15 }]}>{c.text}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Stats (footer target) */}
        <LinearGradient
          ref={footerRef}
          colors={["#16a34a", "#f97316"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statsSection, { paddingHorizontal: padX, paddingVertical: padY }]}
        >
          <View style={[styles.statsGrid, { gap: 16 }]}>
            {[
              ["0", "Mothers Helped"],
              ["92%", "Accuracy Rate"],
              ["24/7", "Support Available"],
              ["0", "Health Centers"],
            ].map(([n, l]) => (
              <View key={l} style={[styles.statBox, { flexBasis: statBasis }]}>
                <Text style={[styles.statNumber, { fontSize: isPlus ? 30 : isRegular ? 28 : 26 }]}>{n}</Text>
                <Text style={[styles.statLabel, { fontSize: isCompact ? 14 : 15 }]}>{l}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
  },

  /* Hero */
  heroWrap: {
    backgroundColor: "#f7fef9",
  },
  heroInner: {
    alignItems: "center",
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  heroTitle: {
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  heroGradientWord: {
    color: "#16a34a",
  },
  heroSub: {
    lineHeight: 24,
    color: "#4b5563",
    textAlign: "center",
    maxWidth: 600,
    marginBottom: 24,
  },
  ctaRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryBtn: {
    backgroundColor: "#16a34a",
    borderRadius: 999,
    elevation: 3,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 999,
  },
  secondaryBtnText: {
    color: "#374151",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  /* Features */
  featuresSection: {
    backgroundColor: "#fff",
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  sectionSub: {
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 600,
    lineHeight: 22,
  },

  // New grid: 2 cards on first row, 1 full width below
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 12, // vertical gap between rows
  },
  cardGreen: { backgroundColor: "#f0fdf4" },
  cardOrange: { backgroundColor: "#fff7ed" },
  cardMix: { backgroundColor: "#fefce8" },

  iconDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
    elevation: 2,
  },
  iconDotGreen: { backgroundColor: "#22c55e" },
  iconDotOrange: { backgroundColor: "#f97316" },
  iconDotMix: { backgroundColor: "#eab308" },
  iconTick: { color: "#fff", fontSize: 26, fontWeight: "800" },
  iconBook: { color: "#fff", fontSize: 24 },

  cardTitle: {
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 6,
  },
  cardText: {
    color: "#4b5563",
    textAlign: "center",
    lineHeight: 20,
  },

  /* Stats (footer target) */
  statsSection: {
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    maxWidth: 900,
    alignSelf: "center",
    width: "100%",
  },
  statBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
  },
  statNumber: {
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    color: "#fff",
    opacity: 0.9,
  },
});