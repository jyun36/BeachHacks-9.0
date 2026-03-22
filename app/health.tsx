import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getPile, PileItem } from "../src/pileStore";

function calculateHealth(items: PileItem[]) {
  if (items.length === 0) return null;

  const avgCN = items.reduce((s, i) => s + i.cn_ratio, 0) / items.length;
  const avgWeeks = items.reduce((s, i) => s + i.decomp_weeks, 0) / items.length;
  const lowMethaneCount = items.filter(i => i.methane === "low").length;

  const cnScore = Math.max(0, 100 - Math.abs(avgCN - 27.5) * 2.5);
  const methaneScore = (lowMethaneCount / items.length) * 100;
  const decompScore = Math.max(0, 100 - Math.max(0, avgWeeks - 8) * 5);

  const score = Math.round(cnScore * 0.6 + methaneScore * 0.25 + decompScore * 0.15);

  let status = "";
  if (score >= 85) status = "Excellent";
  else if (score >= 65) status = "Good";
  else if (score >= 45) status = "Needs Work";
  else status = "Poor";

  let cnStatus = "";
  if (avgCN < 15) cnStatus = "Too Nitrogen-Heavy";
  else if (avgCN < 25) cnStatus = "Slightly Nitrogen-Heavy";
  else if (avgCN <= 30) cnStatus = "Ideal Range";
  else if (avgCN <= 60) cnStatus = "Slightly Carbon-Heavy";
  else cnStatus = "Too Carbon-Heavy";

  return {
    score, status, cnStatus,
    avgCN: Math.round(avgCN),
    avgWeeks: Math.round(avgWeeks),
    methane: lowMethaneCount >= items.length / 2 ? "Low" : "High",
    materialBalance: Math.round(cnScore),
    decompRate: Math.round(decompScore),
    envImpact: Math.round(methaneScore),
    nutrientQuality: Math.round((cnScore + methaneScore) / 2),
  };
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${value}%` as any, backgroundColor: color }]} />
    </View>
  );
}

export default function HealthScreen() {
  const router = useRouter();
  const [pile, setPile] = useState<PileItem[]>([]);

  useFocusEffect(useCallback(() => {
    getPile().then(setPile);
  }, []));

  const result = calculateHealth(pile);

  if (!result) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No items in your pile yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pile Health</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>

        {/* Health Score Card */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreIconCircle}>
            <Ionicons name="trending-up" size={36} color="#fff" />
          </View>
          <Text style={styles.scoreSubtitle}>Overall Health Score</Text>
          <Text style={styles.scoreNumber}>{result.score}</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreBadgeText}>{result.status}</Text>
          </View>
          <View style={styles.scoreProgressTrack}>
            <View style={[styles.scoreProgressFill, { width: `${result.score}%` as any }]} />
          </View>
        </View>

        {/* 2x2 Metrics Grid */}
        <View style={styles.grid}>
          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#d1fae5" }]}>
              <Ionicons name="water" size={22} color="#059669" />
            </View>
            <Text style={styles.metricLabel}>Moisture Level</Text>
            <Text style={styles.metricValue}>Optimal</Text>
            <ProgressBar value={75} color="#10b981" />
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#dbeafe" }]}>
              <MaterialCommunityIcons name="air-filter" size={22} color="#2563eb" />
            </View>
            <Text style={styles.metricLabel}>C:N Ratio</Text>
            <Text style={styles.metricValue}>{result.avgCN}:1</Text>
            <Text style={[styles.metricNote, {
              color: result.avgCN >= 25 && result.avgCN <= 30 ? "#10b981" : "#f59e0b"
            }]}>
              {result.avgCN >= 25 && result.avgCN <= 30 ? "✓ Ideal range" : `⚠ ${result.cnStatus}`}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#ede9fe" }]}>
              <MaterialCommunityIcons name="weather-windy" size={22} color="#7c3aed" />
            </View>
            <Text style={styles.metricLabel}>Methane Output</Text>
            <Text style={styles.metricValue}>{result.methane}</Text>
            <Text style={[styles.metricNote, {
              color: result.methane === "Low" ? "#10b981" : "#dc2626"
            }]}>
              {result.methane === "Low" ? "✓ Eco-friendly" : "⚠ High risk"}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#fef3c7" }]}>
              <Ionicons name="time" size={22} color="#d97706" />
            </View>
            <Text style={styles.metricLabel}>Decomp. Time</Text>
            <Text style={styles.metricValue}>~{result.avgWeeks} weeks</Text>
            <Text style={styles.metricNote}>Average</Text>
          </View>
        </View>

        {/* Fetch.ai Agent Suggestions */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.agentIcon}>
              <Ionicons name="sparkles" size={18} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Fetch.ai Agent Suggestions</Text>
          </View>

          <View style={[styles.suggestionCard, { backgroundColor: "#faf5ff", borderColor: "#e9d5ff" }]}>
            <Text style={styles.suggestionEmoji}>🎯</Text>
            <View style={styles.suggestionText}>
              <Text style={styles.suggestionTitle}>
                {result.avgCN >= 25 && result.avgCN <= 30
                  ? "Perfect Balance"
                  : result.avgCN < 25 ? "Add Carbon Materials" : "Add Nitrogen Materials"}
              </Text>
              <Text style={styles.suggestionBody}>
                {result.avgCN >= 25 && result.avgCN <= 30
                  ? "Your C:N ratio is excellent! Keep adding materials at your current pace."
                  : result.avgCN < 25
                  ? "Your pile is nitrogen-heavy. Add cardboard, dry leaves, or wood chips to balance it."
                  : "Your pile needs more nitrogen. Add fruit scraps, grass clippings, or coffee grounds."}
              </Text>
            </View>
          </View>

          <View style={[styles.suggestionCard, { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }]}>
            <Text style={styles.suggestionEmoji}>
              {result.avgWeeks <= 8 ? "⚡" : "🐢"}
            </Text>
            <View style={styles.suggestionText}>
              <Text style={styles.suggestionTitle}>
                {result.avgWeeks <= 8 ? "Fast Decomposition" : "Slow Decomposition"}
              </Text>
              <Text style={styles.suggestionBody}>
                {result.avgWeeks <= 8
                  ? `Estimated ~${result.avgWeeks} weeks to compost. Turn your pile every 3–4 days to maintain moisture.`
                  : `Estimated ~${result.avgWeeks} weeks. Chop items smaller and add nitrogen-rich materials to speed things up.`}
              </Text>
            </View>
          </View>

          <View style={[styles.suggestionCard, { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }]}>
            <Text style={styles.suggestionEmoji}>
              {result.methane === "Low" ? "🌿" : "⚠️"}
            </Text>
            <View style={styles.suggestionText}>
              <Text style={styles.suggestionTitle}>
                {result.methane === "Low" ? "Low Methane Emissions" : "Methane Warning"}
              </Text>
              <Text style={styles.suggestionBody}>
                {result.methane === "Low"
                  ? "Your pile is aerobic and eco-friendly. Keep turning it regularly to maintain airflow."
                  : "High methane risk detected. Add more carbon-rich dry materials and turn your pile more frequently."}
              </Text>
            </View>
          </View>
        </View>

        {/* Health Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Breakdown</Text>
          {[
            { label: "Material Balance", value: result.materialBalance },
            { label: "Decomposition Rate", value: result.decompRate },
            { label: "Environmental Impact", value: result.envImpact },
            { label: "Nutrient Quality", value: result.nutrientQuality },
          ].map((item) => ({ ...item, color: item.value >= 65 ? "#10b981" : item.value >= 45 ? "#f59e0b" : "#ef4444" })).map((item) => (
            <View key={item.label} style={styles.breakdownRow}>
              <View style={styles.breakdownLabelRow}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={[styles.breakdownValue, { color: item.color }]}>{item.value}%</Text>
              </View>
              <ProgressBar value={item.value} color={item.color} />
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => router.push("/pile" as any)}>
          <Text style={styles.bottomBtnText}>View My Pile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0fdf4" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#9ca3af" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },

  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  // Score Card
  scoreCard: {
    backgroundColor: "#059669",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  scoreIconCircle: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  scoreSubtitle: { fontSize: 15, color: "rgba(255,255,255,0.8)", marginBottom: 8 },
  scoreNumber: { fontSize: 72, fontWeight: "bold", color: "#fff", lineHeight: 80 },
  scoreBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, marginTop: 8, marginBottom: 16,
  },
  scoreBadgeText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  scoreProgressTrack: {
    width: "100%", height: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999, overflow: "hidden",
  },
  scoreProgressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 999 },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 16, padding: 16,
    width: "47%",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  metricIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  metricLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  metricNote: { fontSize: 11, color: "#10b981", fontWeight: "500", marginTop: 4 },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16, padding: 20,
    marginBottom: 16,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
  agentIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#8b5cf6",
    justifyContent: "center", alignItems: "center",
  },

  // Suggestions
  suggestionCard: {
    flexDirection: "row", gap: 12,
    padding: 14, borderRadius: 12,
    borderWidth: 1, marginBottom: 10,
  },
  suggestionEmoji: { fontSize: 24 },
  suggestionText: { flex: 1 },
  suggestionTitle: { fontSize: 13, fontWeight: "600", color: "#111827", marginBottom: 4 },
  suggestionBody: { fontSize: 13, color: "#374151", lineHeight: 18 },

  // Breakdown
  breakdownRow: { marginBottom: 14 },
  breakdownLabelRow: {
    flexDirection: "row", justifyContent: "space-between", marginBottom: 6,
  },
  breakdownLabel: { fontSize: 13, color: "#374151" },
  breakdownValue: { fontSize: 13, fontWeight: "600" },
  progressTrack: {
    width: "100%", height: 8,
    backgroundColor: "#e5e7eb", borderRadius: 999, overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 999 },

  // Warning
  warningCard: {
    flexDirection: "row", gap: 12,
    backgroundColor: "#fffbeb",
    borderWidth: 1, borderColor: "#fde68a",
    borderRadius: 12, padding: 16,
    marginBottom: 16,
  },
  warningText: { flex: 1 },
  warningTitle: { fontSize: 13, fontWeight: "600", color: "#92400e", marginBottom: 4 },
  warningBody: { fontSize: 13, color: "#b45309", lineHeight: 18 },

  // Bottom
  bottomBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  bottomBtn: {
    backgroundColor: "#059669",
    paddingVertical: 16, borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4,
  },
  bottomBtnText: { color: "#fff", fontSize: 17, fontWeight: "600" },
});
