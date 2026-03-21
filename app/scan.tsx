import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Modal } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

const GEMINI_API_KEY = "AIzaSyD5UUkc_dOgK1i1Z6P-gi_1tyZkrS-x_tQ";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

type ScanResult = {
  item: string;
  compostable: boolean;
  reason: string;
  tip: string;
  cn_ratio: string;
};

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();

  const takePhoto = async () => {
    if (!cameraRef.current || loading) return;
    setLoading(true);
    setResult(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      if (!photo?.uri) return;

      setPhotos((prev) => [photo.uri, ...prev]);

      // Read image as base64
      const base64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Call Gemini Vision
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a composting expert. Look at this image and identify the main item.
      Respond ONLY with a JSON object in this exact format:
      {
        "item": "name of item",
        "compostable": true or false,
        "reason": "one sentence why it is or isn't compostable",
        "tip": "one helpful tip for composting or disposal",
        "cn_ratio": "high carbon / high nitrogen / balanced / not applicable"
      }`;

      const response = await model.generateContent([
        prompt,
        { inlineData: { mimeType: "image/jpeg", data: base64 } },
      ]);

      const text = response.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setResult(parsed);
      }
    } catch (e) {
      setResult({
        item: "Unknown",
        compostable: false,
        reason: "Could not analyze the image. Please try again.",
        tip: "Make sure the item is clearly visible.",
        cn_ratio: "N/A",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>We need access to your camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionBtn}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.cameraContainer}>
        {isFocused && <CameraView ref={cameraRef} style={styles.camera} facing="back" />}

        {/* Corner overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanBox}>
            <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 }]} />
            <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 }]} />
            <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 }]} />
            <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 }]} />
          </View>
          <Text style={styles.scanHint}>Point at an item to scan</Text>
        </View>

        {/* Shutter button */}
        <View style={styles.shutterContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <TouchableOpacity onPress={takePhoto} style={styles.shutterBtn} />
          )}
        </View>
      </View>

      {/* Photo strip */}
      {photos.length > 0 && (
        <View style={styles.photoStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 10, gap: 8 }}>
            {photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.thumbnail} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Result Modal */}
      <Modal visible={result !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[styles.resultBadge, { backgroundColor: result?.compostable ? "#d1fae5" : "#fee2e2" }]}>
              <Ionicons
                name={result?.compostable ? "checkmark-circle" : "close-circle"}
                size={40}
                color={result?.compostable ? "#059669" : "#dc2626"}
              />
              <Text style={[styles.resultStatus, { color: result?.compostable ? "#059669" : "#dc2626" }]}>
                {result?.compostable ? "Compostable!" : "Not Compostable"}
              </Text>
            </View>

            <Text style={styles.itemName}>{result?.item}</Text>
            <Text style={styles.resultReason}>{result?.reason}</Text>

            <View style={styles.resultMeta}>
              <Text style={styles.metaLabel}>C:N Ratio</Text>
              <Text style={styles.metaValue}>{result?.cn_ratio}</Text>
            </View>

            <View style={styles.tipBox}>
              <Ionicons name="bulb" size={16} color="#d97706" />
              <Text style={styles.tipText}>{result?.tip}</Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setResult(null)}>
              <Text style={styles.closeBtnText}>Scan Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  permissionText: { color: "white", marginBottom: 20, fontSize: 16 },
  permissionBtn: { padding: 12, backgroundColor: "#059669", borderRadius: 8 },
  permissionBtnText: { color: "white", fontWeight: "600" },

  cameraContainer: { flex: 1 },
  camera: { flex: 1 },

  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: "center", alignItems: "center",
  },
  scanBox: { width: 250, height: 250, position: "relative" },
  corner: {
    position: "absolute", width: 40, height: 40,
    borderColor: "white",
  },
  scanHint: {
    color: "rgba(255,255,255,0.8)", marginTop: 16,
    fontSize: 14, fontWeight: "500",
  },

  shutterContainer: {
    position: "absolute", bottom: 80, left: 0, right: 0, alignItems: "center",
  },
  shutterBtn: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: "white", borderWidth: 4, borderColor: "#ccc",
  },

  photoStrip: { height: 120, backgroundColor: "#111" },
  thumbnail: { width: 90, height: 90, borderRadius: 8 },

  // Modal
  modalOverlay: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 40,
  },
  resultBadge: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 16, borderRadius: 16, marginBottom: 16,
  },
  resultStatus: { fontSize: 22, fontWeight: "bold" },
  itemName: { fontSize: 26, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  resultReason: { fontSize: 15, color: "#6b7280", marginBottom: 16, lineHeight: 22 },
  resultMeta: {
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: "#f9fafb", padding: 14, borderRadius: 12, marginBottom: 12,
  },
  metaLabel: { fontSize: 14, color: "#6b7280", fontWeight: "500" },
  metaValue: { fontSize: 14, color: "#111827", fontWeight: "600" },
  tipBox: {
    flexDirection: "row", gap: 8, alignItems: "flex-start",
    backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fde68a",
    padding: 14, borderRadius: 12, marginBottom: 20,
  },
  tipText: { flex: 1, fontSize: 14, color: "#92400e", lineHeight: 20 },
  closeBtn: {
    backgroundColor: "#059669", paddingVertical: 16,
    borderRadius: 16, alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
