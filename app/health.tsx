import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

const AGENT_URL = "https://adrianna-intercrural-behaviorally.ngrok-free.dev/analyze";

export default function HealthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [pile, setPile] = useState<PileItem[]>([]);
  const [agentTips, setAgentTips] = useState<string[] | null>(null);
  const [agentLoading, setAgentLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  useFocusEffect(useCallback(() => {
    setAgentTips(null);
    setIsLive(false);
    getPile().then(setPile);
  }, []));

  const getFallback = (items: PileItem[], r: ReturnType<typeof calculateHealth>) => {
    if (!r) return [];
    return [
      r.avgCN < 25
        ? "Nitrogen-heavy pile. Add cardboard or dry leaves."
        : r.avgCN > 30
        ? "Carbon-heavy pile. Add fruit scraps or coffee grounds."
        : "C:N ratio looks good. Keep mixing greens and browns.",
      r.avgWeeks <= 8
        ? "Decomposition on track. Turn every 3–4 days."
        : "Slow decomp. Chop items smaller and keep pile moist.",
      r.methane === "Low"
        ? "Low methane — pile is aerobic. Keep turning it."
        : "High methane risk. Add dry materials and aerate daily.",
    ];
  };

  const handleGenerate = async () => {
    if (pile.length === 0) return;
    setAgentLoading(true);
    setAgentTips(null);
    setIsLive(false);
    try {
      const timeout = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 4000)
      );
      const data: any = await Promise.race([
        fetch(AGENT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
          body: JSON.stringify({
            items: pile.map((i) => ({
              item: i.item,
              cn_ratio: i.cn_ratio,
              decomp_weeks: i.decomp_weeks,
              methane: i.methane,
            })),
          }),
        }).then((r) => r.json()),
        timeout,
      ]);
      if (data?.improvements) {
        setAgentTips(data.improvements);
        setIsLive(true);
      } else {
        setAgentTips(getFallback(pile, result));
      }
    } catch {
      setAgentTips(getFallback(pile, result));
    }
    setAgentLoading(false);
  };

  const result = calculateHealth(pile);

  if (!result) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="leaf-outline" size={48} color="#059669" />
        <Text style={styles.emptyText}>No items in your pile yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
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
            <ProgressBar value={75} color="#059669" />
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#dbeafe" }]}>
              <MaterialCommunityIcons name="air-filter" size={22} color="#2563eb" />
            </View>
            <Text style={styles.metricLabel}>C:N Ratio</Text>
            <Text style={styles.metricValue}>{result.avgCN}:1</Text>
            <Text style={[styles.metricNote, {
              color: result.avgCN >= 25 && result.avgCN <= 30 ? "#059669" : "#2563eb"
            }]}>
              {result.avgCN >= 25 && result.avgCN <= 30 ? "✓ Ideal range" : `⚠ ${result.cnStatus}`}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#d1fae5" }]}>
              <MaterialCommunityIcons name="weather-windy" size={22} color="#059669" />
            </View>
            <Text style={styles.metricLabel}>Methane Output</Text>
            <Text style={styles.metricValue}>{result.methane}</Text>
            <Text style={[styles.metricNote, {
              color: result.methane === "Low" ? "#059669" : "#2563eb"
            }]}>
              {result.methane === "Low" ? "✓ Eco-friendly" : "⚠ High risk"}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: "#dbeafe" }]}>
              <Ionicons name="time" size={22} color="#2563eb" />
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
            {agentTips !== null && (
              <View style={[styles.liveBadge, { backgroundColor: isLive ? "#d1fae5" : "#e5e7eb" }]}>
                <Text style={[styles.liveBadgeText, { color: isLive ? "#059669" : "#6b7280" }]}>
                  {isLive ? "● Live" : "● Offline"}
                </Text>
              </View>
            )}
          </View>

          {agentTips === null && !agentLoading && (
            pile.length === 0
              ? <Text style={styles.suggestionBody}>Add items to your pile first.</Text>
              : <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
                  <Text style={styles.generateBtnText}>Generate Suggestions</Text>
                </TouchableOpacity>
          )}

          {agentLoading && (
            <Text style={[styles.suggestionBody, { color: "#6b7280" }]}>Analyzing your pile...</Text>
          )}

          {agentTips !== null && (agentTips).map((tip, i) => (
            <View key={i} style={[styles.suggestionCard, {
              backgroundColor: isLive ? "#f0fdf4" : "#f9fafb",
              borderColor: isLive ? "#bbf7d0" : "#e5e7eb",
            }]}>
              <Ionicons name="checkmark-circle" size={24} color={isLive ? "#059669" : "#9ca3af"} />
              <View style={styles.suggestionText}>
                <Text style={styles.suggestionBody}>{tip}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Health Breakdown */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Breakdown</Text>
          {[
            { label: "Material Balance", value: result.materialBalance },
            { label: "Decomposition Rate", value: result.decompRate },
            { label: "Environmental Impact", value: result.envImpact },
            { label: "Nutrient Quality", value: result.nutrientQuality },
          ].map((item) => ({ ...item, color: item.value >= 65 ? "#059669" : item.value >= 45 ? "#2563eb" : "#6b7280" })).map((item) => (
            <View key={item.label} style={styles.breakdownRow}>
              <View style={styles.breakdownLabelRow}>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <Text style={[styles.breakdownValue, { color: item.color }]}>{item.value}%</Text>
              </View>
              <ProgressBar value={item.value} color={item.color} />
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0fdf4" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyText: { fontSize: 18, color: "#6b7280" },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: {
    width: 36, height: 36,
    borderRadius: 18,
    justifyContent: "center", alignItems: "center",
    backgroundColor: "#e6f4ef",
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
  },
  scoreIconCircle: {
    width: 72, height: 72,
    borderRadius: 36,
    backgroundColor: "#047857",
    justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  scoreSubtitle: { fontSize: 15, color: "#d1fae5", marginBottom: 8 },
  scoreNumber: { fontSize: 72, fontWeight: "bold", color: "#fff", lineHeight: 80 },
  scoreBadge: {
    backgroundColor: "#047857",
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 999, marginTop: 8, marginBottom: 16,
  },
  scoreBadgeText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  scoreProgressTrack: {
    width: "100%", height: 10,
    backgroundColor: "#047857",
    borderRadius: 999, overflow: "hidden",
  },
  scoreProgressFill: { height: "100%", backgroundColor: "#fff", borderRadius: 999 },

  // Grid
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 16 },
  metricCard: {
    backgroundColor: "#fff",
    borderRadius: 16, padding: 16,
    width: "47%",
  },
  metricIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginBottom: 10,
  },
  metricLabel: { fontSize: 12, color: "#6b7280", marginBottom: 4 },
  metricValue: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  metricNote: { fontSize: 11, color: "#059669", fontWeight: "500", marginTop: 4 },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16, padding: 20,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#111827", marginBottom: 12 },
  agentIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: "#059669",
    justifyContent: "center", alignItems: "center",
  },

  // Suggestions
  suggestionCard: {
    flexDirection: "row", gap: 12,
    padding: 14, borderRadius: 12,
    borderWidth: 1, marginBottom: 10,
  },
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

  // Warning (unused but kept for safety)
  warningCard: {
    flexDirection: "row", gap: 12,
    backgroundColor: "#f0fdf4",
    borderWidth: 1, borderColor: "#bbf7d0",
    borderRadius: 12, padding: 16,
    marginBottom: 16,
  },
  warningText: { flex: 1 },
  warningTitle: { fontSize: 13, fontWeight: "600", color: "#065f46", marginBottom: 4 },
  warningBody: { fontSize: 13, color: "#059669", lineHeight: 18 },

  liveBadge: { marginLeft: "auto", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  liveBadgeText: { fontSize: 11, fontWeight: "600" },

  generateBtn: {
    backgroundColor: "#059669", borderRadius: 10,
    paddingVertical: 12, alignItems: "center", marginTop: 4,
  },
  generateBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },

});
