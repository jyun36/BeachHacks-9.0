import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getPile, clearPile, removeFromPile, PileItem } from "../src/pileStore";
import { Ionicons } from "@expo/vector-icons";

export default function PileScreen() {
  const [pile, setPile] = useState<PileItem[]>([]);
  const insets = useSafeAreaInsets();

  useFocusEffect(useCallback(() => {
    getPile().then(setPile);
  }, []));

  const handleClear = () => {
    Alert.alert("Clear Pile", "Remove all items from your compost pile?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All", style: "destructive",
        onPress: async () => { await clearPile(); setPile([]); },
      },
    ]);
  };

  const handleRemove = async (id: string) => {
    await removeFromPile(id);
    getPile().then(setPile);
  };

  const totalItems = pile.length;
  const avgCN = totalItems > 0 ? Math.round(pile.reduce((s, i) => s + i.cn_ratio, 0) / totalItems) : 0;
  const avgWeeks = totalItems > 0 ? Math.round(pile.reduce((s, i) => s + i.decomp_weeks, 0) / totalItems) : 0;

  return (
    <View style={styles.root}>

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>My Compost Pile</Text>
        {pile.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearBtn}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ImageBackground
        source={require("../assets/images/compost.png")}
        style={StyleSheet.absoluteFill}
        imageStyle={{ opacity: 0.07, width: "65%", height: "65%", top: "30%", left: "17%" }}
        resizeMode="contain"
      />

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalItems}</Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{avgCN > 0 ? `${avgCN}:1` : "--"}</Text>
          <Text style={styles.statLabel}>Avg C:N</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{avgWeeks > 0 ? `~${avgWeeks}` : "--"}</Text>
          <Text style={styles.statLabel}>Est. Weeks</Text>
        </View>
      </View>

      {pile.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="leaf-outline" size={64} color="#059669" />
          <Text style={styles.emptyTitle}>Your pile is empty</Text>
          <Text style={styles.emptySubtext}>
            Scan compostable items and tap{"\n"}"Add to My Compost Pile" to get started!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {pile.map((item, i) => (
            <View key={item.id} style={styles.itemCard}>

              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{i + 1}</Text>
              </View>

              <View style={styles.itemIcon}>
                <Ionicons name="leaf" size={22} color="#059669" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.item}</Text>
                <View style={styles.tagRow}>
                  <View style={[styles.tag, { backgroundColor: "#d1fae5" }]}>
                    <Text style={[styles.tagText, { color: "#065f46" }]}>C:N {item.cn_ratio}:1</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: "#dbeafe" }]}>
                    <Text style={[styles.tagText, { color: "#1e40af" }]}>{item.decomp_weeks}wks</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: item.methane === "low" ? "#f0fdf4" : "#dbeafe" }]}>
                    <Text style={[styles.tagText, { color: item.methane === "low" ? "#166534" : "#1e40af" }]}>
                      CH₄ {item.methane}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeBtn}>
                <Ionicons name="close" size={16} color="#9ca3af" />
              </TouchableOpacity>

            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0fdf4" },

  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: "white",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 4,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },
  clearBtn: { backgroundColor: "#e6f4ef", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  clearText: { color: "#059669", fontWeight: "600", fontSize: 13 },

  statsRow: {
    flexDirection: "row", backgroundColor: "white",
    marginHorizontal: 16, marginTop: 16, borderRadius: 18, padding: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.09, shadowRadius: 12, elevation: 4,
  },
  statCard: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 26, fontWeight: "800", color: "#059669" },
  statLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  statDivider: { width: 1, backgroundColor: "#e5e7eb", marginVertical: 4 },

  empty: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#374151", marginTop: 8 },
  emptySubtext: { fontSize: 14, color: "#9ca3af", textAlign: "center", lineHeight: 20 },

  list: { padding: 16, gap: 10 },
  itemCard: {
    backgroundColor: "white", borderRadius: 16, padding: 14,
    flexDirection: "row", alignItems: "center", gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },
  numberBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#059669", justifyContent: "center", alignItems: "center",
  },
  numberText: { color: "white", fontWeight: "700", fontSize: 13 },
  itemIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#d1fae5", justifyContent: "center", alignItems: "center",
  },
  itemName: { fontSize: 15, fontWeight: "600", color: "#111827", marginBottom: 6 },
  tagRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: "600" },
  removeBtn: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center",
  },
});
