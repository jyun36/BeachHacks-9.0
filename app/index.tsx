import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { Text, View, TouchableOpacity, Modal, Animated, StyleSheet } from "react-native";
import { analyzeItem } from "../src/gemini";
import { addToPile } from "../src/pileStore";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const loadingAnim = useRef(new Animated.Value(0)).current;

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

  const barWidth = loadingAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] });

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
