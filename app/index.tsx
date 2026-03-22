import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { Text, View, TouchableOpacity, Modal, Animated, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { analyzeItem } from "../src/gemini";
import { addToPile, getPile } from "../src/pileStore";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [scanCount, setScanCount] = useState(0);
  const [compostCount, setCompostCount] = useState(0);
  const [scoreImproved, setScoreImproved] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const loadingAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (loading) {
      loadingAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingAnim, { toValue: 1, duration: 1400, useNativeDriver: false }),
          Animated.timing(loadingAnim, { toValue: 0, duration: 0, useNativeDriver: false }),
        ])
      ).start();
    } else {
      loadingAnim.stopAnimation();
    }
  }, [loading]);

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ base64: false });
    if (!photo?.uri) return;
    setResult(null);
    setLoading(true);
    try {
      const analysis = await analyzeItem(photo.uri);
      setResult(analysis);
      setShowModal(true);
      setScanCount(c => c + 1);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleAddToCompost = async () => {
    if (result) {
      await addToPile({
        item: result.item,
        cn_ratio: result.cn_ratio,
        decomp_weeks: result.decomp_weeks,
        methane: result.methane,
        reason: result.reason,
      });
      setCompostCount(c => c + 1);
      const pile = await getPile();
      if (pile.length > 0) {
        const avgCN = pile.reduce((s, i) => s + i.cn_ratio, 0) / pile.length;
        const avgWeeks = pile.reduce((s, i) => s + i.decomp_weeks, 0) / pile.length;
        const lowMethane = pile.filter(i => i.methane === "low").length;
        const cnScore = Math.max(0, 100 - Math.abs(avgCN - 27.5) * 2.5);
        const methaneScore = (lowMethane / pile.length) * 100;
        const decompScore = Math.max(0, 100 - Math.max(0, avgWeeks - 8) * 5);
        const score = Math.round(cnScore * 0.6 + methaneScore * 0.25 + decompScore * 0.15);
        if (score >= 90) setScoreImproved(true);
      }
    }
    setShowModal(false);
    setResult(null);
  };

  const handleDismiss = () => {
    setShowModal(false);
    setResult(null);
  };

  useFocusEffect(useCallback(() => {
    return () => setResult(null);
  }, []));

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required to scan items</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleTasks = (open: boolean) => {
    setShowTasks(open);
    Animated.spring(slideAnim, {
      toValue: open ? 0 : 300,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const barWidth = loadingAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

  const tasks = [
    { label: "Take 5 scans", current: Math.min(scanCount, 5), goal: 5, done: scanCount >= 5 },
    { label: "Compost 3 items", current: Math.min(compostCount, 3), goal: 3, done: compostCount >= 3 },
    { label: "Reach a score of 90", current: scoreImproved ? 1 : 0, goal: 1, done: scoreImproved },
  ];
  const completedCount = tasks.filter(t => t.done).length;

  return (
    <View style={styles.root}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      {/* Corner viewfinder overlay */}
      <View style={styles.viewfinderContainer} pointerEvents="none">
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      {/* Daily Tasks button — top left */}
      <View style={styles.tasksButtonContainer}>
        <TouchableOpacity onPress={() => toggleTasks(!showTasks)} style={styles.tasksButton}>
          <Ionicons name="leaf" size={20} color="white" />
          {completedCount > 0 && (
            <View style={styles.tasksBadge}>
              <Text style={styles.tasksBadgeText}>{completedCount}</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>

      {/* Centered loading bar */}
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <View style={styles.loadingBarTrack}>
            <Animated.View style={[styles.loadingBarFill, { width: barWidth }]} />
          </View>
        </View>
      )}

      {/* Shutter button */}
      <View style={styles.shutterContainer}>
        <TouchableOpacity
          onPress={takePhoto}
          disabled={loading}
          style={[styles.shutter, loading && styles.shutterDisabled]}
        />
      </View>

      {/* Daily Tasks bottom sheet */}
      {showTasks && (
        <TouchableOpacity style={styles.tasksBackdrop} activeOpacity={1} onPress={() => toggleTasks(false)} />
      )}
      <Animated.View style={[styles.tasksSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.tasksHandle} />
        <Text style={styles.tasksPanelTitle}>Daily Tasks</Text>
        {tasks.map((task, i) => (
          <View key={i} style={styles.taskRow}>
            <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
              <Ionicons name="checkmark-circle" size={26} color={task.done ? "#059669" : "#d1d5db"} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.taskLabel, task.done && styles.taskLabelDone]}>{task.label}</Text>
              <View style={styles.taskTrack}>
                <View style={[styles.taskFill, { width: `${(task.current / task.goal) * 100}%` as any }]} />
              </View>
              <Text style={styles.taskProgress}>{task.current}/{task.goal}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      {/* Result Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            {result?.compostable ? (
              <>
                <Text style={styles.modalEmoji}>♻️</Text>
                <Text style={[styles.modalTitle, { color: "#059669" }]}>Compostable!</Text>
                <Text style={styles.modalItemName}>{result?.item}</Text>
                <Text style={styles.modalReason}>{result?.reason}</Text>
                <TouchableOpacity onPress={handleAddToCompost} style={styles.btnPrimary}>
                  <Text style={styles.btnPrimaryText}>✅ Add to My Compost Pile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDismiss} style={styles.btnSecondary}>
                  <Text style={styles.btnSecondaryText}>Skip</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalEmoji}>🚫</Text>
                <Text style={[styles.modalTitle, { color: "#dc2626" }]}>Not Compostable</Text>
                <Text style={styles.modalItemName}>{result?.item}</Text>
                <Text style={styles.modalReason}>{result?.reason}</Text>
                <View style={styles.disposalCard}>
                  <Text style={styles.disposalTitle}>♻️ How to dispose:</Text>
                  <Text style={styles.disposalBody}>
                    Place this item in your recycling or general waste bin. Do not add to compost as it may contaminate your pile.
                  </Text>
                </View>
                <TouchableOpacity onPress={handleDismiss} style={styles.btnSecondary}>
                  <Text style={styles.btnSecondaryText}>Got it</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const CORNER = 40;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },

  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  permissionText: { color: "white", marginBottom: 20, fontSize: 16, textAlign: "center", paddingHorizontal: 32 },
  permissionBtn: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: "#059669", borderRadius: 10 },
  permissionBtnText: { color: "white", fontWeight: "600", fontSize: 15 },

  viewfinderContainer: { position: "absolute", top: 200, left: 0, right: 0, alignItems: "center" },
  viewfinder: { width: 250, height: 250, position: "relative" },
  corner: { position: "absolute", width: CORNER, height: CORNER, borderColor: "rgba(255,255,255,0.9)" },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },

  // Daily tasks
  tasksButtonContainer: { position: "absolute", top: 60, left: 16 },
  tasksButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#059669",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  tasksBadge: {
    position: "absolute", top: -4, right: -4,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: "#fbbf24", justifyContent: "center", alignItems: "center",
  },
  tasksBadgeText: { fontSize: 10, fontWeight: "700", color: "#111827" },
  tasksBackdrop: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
  },
  tasksSheet: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 40,
    shadowColor: "#000", shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 24,
  },
  tasksHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: "#d1d5db", alignSelf: "center", marginBottom: 20,
  },
  tasksPanelTitle: { color: "#111827", fontWeight: "700", fontSize: 16, marginBottom: 16 },
  taskRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 12 },
  taskCheck: { justifyContent: "center", alignItems: "center", marginTop: 1, marginRight: 2 },
  taskCheckDone: {},
  taskLabel: { color: "#111827", fontSize: 13, fontWeight: "500", marginBottom: 4 },
  taskLabelDone: { color: "#059669", textDecorationLine: "line-through" },
  taskTrack: {
    width: "100%", height: 5,
    backgroundColor: "#e5e7eb",
    borderRadius: 999, overflow: "hidden",
  },
  taskFill: { height: "100%", backgroundColor: "#059669", borderRadius: 999 },
  taskProgress: { color: "#9ca3af", fontSize: 11, marginTop: 3 },

  loadingOverlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center",
  },
  loadingBarTrack: {
    width: 160, height: 8,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999, overflow: "hidden",
  },
  loadingBarFill: { height: "100%", backgroundColor: "white", borderRadius: 999 },

  shutterContainer: { position: "absolute", bottom: 80, left: 0, right: 0, alignItems: "center" },
  shutter: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "white", borderWidth: 4, borderColor: "rgba(255,255,255,0.6)",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },
  shutterDisabled: { opacity: 0.45 },

  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.55)" },
  modalSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28,
    shadowColor: "#000", shadowOffset: { width: 0, height: -6 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 24,
  },

  modalEmoji: { fontSize: 48, textAlign: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginTop: 8 },
  modalItemName: { fontSize: 16, fontWeight: "600", color: "#111827", textAlign: "center", marginTop: 4 },
  modalReason: { fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 8, marginBottom: 24, lineHeight: 20 },

  btnPrimary: {
    backgroundColor: "#059669", borderRadius: 14,
    paddingVertical: 16, alignItems: "center", marginBottom: 12,
    shadowColor: "#059669", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnPrimaryText: { color: "white", fontWeight: "bold", fontSize: 16 },
  btnSecondary: { backgroundColor: "#f3f4f6", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  btnSecondaryText: { color: "#374151", fontWeight: "600", fontSize: 16 },

  disposalCard: { backgroundColor: "#fef3c7", borderRadius: 12, padding: 16, marginTop: 16, marginBottom: 24 },
  disposalTitle: { fontWeight: "600", color: "#92400e", marginBottom: 4 },
  disposalBody: { color: "#b45309", fontSize: 13, lineHeight: 18 },
});
