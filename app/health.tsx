import { View, Text, ScrollView, StyleSheet } from "react-native";

// Fake pile data — Person 2, replace this with real data later
const fakePile = [
  { name: "Apple core", cn: 15 },
  { name: "Cardboard", cn: 350 },
  { name: "Grass clippings", cn: 20 },
  { name: "Coffee grounds", cn: 20 },
  { name: "Dry leaves", cn: 60 },
];

function calculateHealth(items: { name: string; cn: number }[]) {
  if (items.length === 0) return null;

  const avgCN = items.reduce((sum, i) => sum + i.cn, 0) / items.length;
  const ideal = 27.5; // midpoint of 25-30
  const diff = Math.abs(avgCN - ideal);

  // score out of 100 — closer to ideal = higher score
  const score = Math.max(0, Math.round(100 - diff * 1.5));

  let status = "";
  let methane = "";
  let tip = "";

  if (avgCN < 15) {
    status = "Too Nitrogen-Heavy";
    methane = "High";
    tip = "Add cardboard or dry leaves to balance it out.";
  } else if (avgCN < 25) {
    status = "Slightly Nitrogen-Heavy";
    methane = "Medium";
    tip = "Add some brown materials like paper or straw.";
  } else if (avgCN <= 30) {
    status = "Ideal Balance";
    methane = "Low";
    tip = "Your pile is well balanced. Keep it moist and turn it weekly.";
  } else if (avgCN <= 60) {
    status = "Slightly Carbon-Heavy";
    methane = "Low";
    tip = "Add nitrogen-rich scraps like fruit peels or grass.";
  } else {
    status = "Too Carbon-Heavy";
    methane = "Low";
    tip = "Add lots of nitrogen-rich greens — your pile is too dry.";
  }

  const decompWeeks = Math.round(avgCN / 10);

  return { score, status, avgCN: Math.round(avgCN), methane, tip, decompWeeks };
}

export default function HealthScreen() {
  const result = calculateHealth(fakePile);

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>No items in your pile yet.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pile Health</Text>

      <View style={styles.scoreBox}>
        <Text style={styles.scoreNumber}>{result.score}</Text>
        <Text style={styles.scoreLabel}>/ 100</Text>
      </View>

      <Text style={styles.status}>{result.status}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stats</Text>
        <Text style={styles.stat}>C:N Ratio: {result.avgCN}:1  (ideal: 25–30)</Text>
        <Text style={styles.stat}>Methane Risk: {result.methane}</Text>
        <Text style={styles.stat}>Est. Decomp Time: ~{result.decompWeeks} weeks</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tip</Text>
        <Text style={styles.tip}>{result.tip}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f0", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#2d6a4f", marginBottom: 20 },
  scoreBox: { flexDirection: "row", alignItems: "flex-end", marginBottom: 8 },
  scoreNumber: { fontSize: 72, fontWeight: "bold", color: "#2d6a4f" },
  scoreLabel: { fontSize: 24, color: "#888", marginBottom: 12 },
  status: { fontSize: 20, color: "#555", marginBottom: 24 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16 },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#2d6a4f", marginBottom: 8 },
  stat: { fontSize: 15, color: "#444", marginBottom: 4 },
  tip: { fontSize: 15, color: "#444", lineHeight: 22 },
  empty: { fontSize: 18, color: "#888", textAlign: "center", marginTop: 100 },
});
