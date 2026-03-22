import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { getPile, clearPile, PileItem, cnRatioToNumber } from "./pileStore";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function PileScreen() {
  const [items, setItems] = useState<PileItem[]>([]);

  // Refresh pile every time this tab is focused
  useFocusEffect(
    useCallback(() => {
      setItems(getPile());
    }, [])
  );

  const handleClear = () => {
    clearPile();
    setItems([]);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="leaf-outline" size={64} color="#d1fae5" />
        <Text style={styles.emptyTitle}>Your pile is empty</Text>
        <Text style={styles.emptySubtitle}>Scan items and add them to see your pile here</Text>
      </View>
    );
  }

  const compostableCount = items.filter((i) => i.compostable).length;
  const avgCN = items.length > 0
    ? items.reduce((sum, i) => sum + cnRatioToNumber(i.cn_ratio), 0) / items.length
    : 27.5;
  const healthScore = Math.max(0, Math.round(100 - Math.abs(avgCN - 27.5) * 1.5));

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Compost Pile</Text>
        <TouchableOpacity onPress={handleClear}>
          <Text style={styles.clearBtn}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{items.length}</Text>
          <Text style={styles.summaryLabel}>Total Items</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#059669" }]}>{compostableCount}</Text>
          <Text style={styles.summaryLabel}>Compostable</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryNumber, { color: "#059669" }]}>{healthScore}</Text>
          <Text style={styles.summaryLabel}>Health Score</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {items.map((item, i) => (
          <View key={i} style={styles.itemCard}>
            <View style={[styles.itemIcon, { backgroundColor: item.compostable ? "#d1fae5" : "#fee2e2" }]}>
              <Text style={styles.itemEmoji}>{item.compostable ? "♻️" : "🚫"}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>C:N — {item.cn_ratio}</Text>
            </View>
            <View style={[styles.itemBadge, { backgroundColor: item.compostable ? "#d1fae5" : "#fee2e2" }]}>
              <Text style={[styles.itemBadgeText, { color: item.compostable ? "#059669" : "#dc2626" }]}>
                {item.compostable ? "Compostable" : "No"}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0fdf4" },

  emptyContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "#f0fdf4", gap: 12,
  },
  emptyTitle: { fontSize: 20, fontWeight: "600", color: "#374151" },
  emptySubtitle: { fontSize: 14, color: "#9ca3af", textAlign: "center", paddingHorizontal: 40 },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1, borderBottomColor: "#e5e7eb",
  },
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
  clearBtn: { fontSize: 14, color: "#dc2626", fontWeight: "500" },

  summary: {
    flexDirection: "row", backgroundColor: "#fff",
    marginHorizontal: 20, marginTop: 16,
    borderRadius: 16, padding: 16,
    shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  summaryNumber: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  summaryLabel: { fontSize: 11, color: "#6b7280", marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: "#e5e7eb" },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, gap: 10 },

  itemCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", borderRadius: 14, padding: 14,
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  itemIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  itemEmoji: { fontSize: 22 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: "600", color: "#111827", textTransform: "capitalize" },
  itemMeta: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  itemBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  itemBadgeText: { fontSize: 11, fontWeight: "600" },
});
