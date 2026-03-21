import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Ionicons name="leaf" size={22} color="#fff" />
        </View>
        <Text style={styles.logoText}>CompostAI</Text>
      </View>

      {/* Hero Text */}
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Ionicons name="sparkles" size={14} color="#059669" />
          <Text style={styles.badgeText}>Powered by Google Gemini & Fetch.ai</Text>
        </View>
        <Text style={styles.heroTitle}>Know What's{"\n"}Compostable</Text>
        <Text style={styles.heroSubtitle}>
          Point your camera at any item and instantly discover if it belongs in your compost bin
        </Text>
      </View>

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=800&q=80" }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay} />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push("/scan")}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.primaryBtnText}>Scan an Item</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/pile")}>
          <Ionicons name="leaf" size={24} color="#059669" />
          <Text style={styles.secondaryBtnText}>My Compost Pile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push("/health")}>
          <Ionicons name="stats-chart" size={24} color="#059669" />
          <Text style={styles.secondaryBtnText}>Pile Health</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0fdf4" },
  content: { padding: 24, paddingBottom: 40 },

  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 32 },
  logoBox: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "#059669",
    justifyContent: "center", alignItems: "center",
  },
  logoText: { fontSize: 20, fontWeight: "600", color: "#111827" },

  hero: { alignItems: "center", marginBottom: 28 },
  badge: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, marginBottom: 16,
  },
  badgeText: { fontSize: 12, color: "#374151" },
  heroTitle: {
    fontSize: 38, fontWeight: "bold", color: "#111827",
    textAlign: "center", lineHeight: 46, marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16, color: "#6b7280", textAlign: "center", lineHeight: 24,
  },

  imageContainer: {
    borderRadius: 24, overflow: "hidden",
    marginBottom: 28,
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
  heroImage: { width: "100%", height: 220 },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  buttons: { gap: 12 },
  primaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12,
    backgroundColor: "#059669",
    paddingVertical: 18, borderRadius: 18,
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  primaryBtnText: { fontSize: 18, fontWeight: "600", color: "#fff" },
  secondaryBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12,
    backgroundColor: "#fff",
    paddingVertical: 18, borderRadius: 18,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  secondaryBtnText: { fontSize: 18, fontWeight: "600", color: "#111827" },
});
