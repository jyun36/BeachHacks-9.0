import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView, Modal } from "react-native";
import { analyzeItem } from "../src/gemini";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      if (photo?.uri) {
        setPhotos((prev) => [photo.uri, ...prev]);
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
      }
    }
  };

  const handleAddToCompost = () => {
    setShowModal(false);
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", marginBottom: 20 }}>We need access to your camera</Text>
        <TouchableOpacity onPress={requestPermission}
          style={{ padding: 12, backgroundColor: "green", borderRadius: 8 }}>
          <Text style={{ color: "white" }}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>

      {/* Camera */}
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing="back" />

        {/* Corner overlay + item name inside */}
        <View style={{ position: "absolute", top: 200, left: 0, right: 0,
          alignItems: "center", pointerEvents: "none" }}>
          <View style={{ width: 250, height: 250, position: "relative",
            justifyContent: "center", alignItems: "center" }}>

            {/* Top Left */}
            <View style={{ position: "absolute", top: 0, left: 0, width: 40, height: 40,
              borderTopWidth: 4, borderLeftWidth: 4, borderColor: "white" }} />
            {/* Top Right */}
            <View style={{ position: "absolute", top: 0, right: 0, width: 40, height: 40,
              borderTopWidth: 4, borderRightWidth: 4, borderColor: "white" }} />
            {/* Bottom Left */}
            <View style={{ position: "absolute", bottom: 0, left: 0, width: 40, height: 40,
              borderBottomWidth: 4, borderLeftWidth: 4, borderColor: "white" }} />
            {/* Bottom Right */}
            <View style={{ position: "absolute", bottom: 0, right: 0, width: 40, height: 40,
              borderBottomWidth: 4, borderRightWidth: 4, borderColor: "white" }} />

            {/* Item name inside box */}
            {loading && (
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600",
                textShadowColor: "black", textShadowRadius: 4 }}>
                Analyzing... 🔍
              </Text>
            )}
            {result && !loading && (
              <View style={{ alignItems: "center" }}>
                <Text style={{
                  color: result.compostable ? "#4ade80" : "#f87171",
                  fontSize: 16, fontWeight: "bold", textAlign: "center",
                  textShadowColor: "black", textShadowRadius: 6,
                }}>
                  {result.item}
                </Text>
                <Text style={{ fontSize: 20, marginTop: 4 }}>
                  {result.compostable ? "✅" : "❌"}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Shutter button */}
        <View style={{ position: "absolute", bottom: 80, left: 0, right: 0,
          alignItems: "center" }}>
          <TouchableOpacity onPress={takePhoto}
            style={{ width: 70, height: 70, borderRadius: 35,
              backgroundColor: "white", borderWidth: 4, borderColor: "#ccc" }} />
        </View>
      </View>

      {/* Photo list */}
      {photos.length > 0 && (
        <View style={{ height: 120, backgroundColor: "black" }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 10, gap: 8 }}>
            {photos.map((uri, i) => (
              <Image key={i} source={{ uri }}
                style={{ width: 90, height: 90, borderRadius: 8 }} />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Result Popup Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end",
          backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: "white", borderTopLeftRadius: 24,
            borderTopRightRadius: 24, padding: 28 }}>

            {result?.compostable ? (
              <>
                <Text style={{ fontSize: 48, textAlign: "center" }}>♻️</Text>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#059669",
                  textAlign: "center", marginTop: 8 }}>
                  Compostable!
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827",
                  textAlign: "center", marginTop: 4 }}>
                  {result?.item}
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center",
                  marginTop: 8, marginBottom: 24 }}>
                  {result?.reason}
                </Text>

                <TouchableOpacity onPress={handleAddToCompost}
                  style={{ backgroundColor: "#059669", borderRadius: 14,
                    paddingVertical: 16, alignItems: "center", marginBottom: 12 }}>
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
                    ✅ Add to My Compost Pile
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleDismiss}
                  style={{ backgroundColor: "#f3f4f6", borderRadius: 14,
                    paddingVertical: 16, alignItems: "center" }}>
                  <Text style={{ color: "#374151", fontWeight: "600", fontSize: 16 }}>
                    Skip
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={{ fontSize: 48, textAlign: "center" }}>🚫</Text>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#dc2626",
                  textAlign: "center", marginTop: 8 }}>
                  Not Compostable
                </Text>
                <Text style={{ fontSize: 16, fontWeight: "600", color: "#111827",
                  textAlign: "center", marginTop: 4 }}>
                  {result?.item}
                </Text>
                <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center",
                  marginTop: 8 }}>
                  {result?.reason}
                </Text>

                <View style={{ backgroundColor: "#fef3c7", borderRadius: 12,
                  padding: 16, marginTop: 16, marginBottom: 24 }}>
                  <Text style={{ fontWeight: "600", color: "#92400e", marginBottom: 4 }}>
                    ♻️ How to dispose:
                  </Text>
                  <Text style={{ color: "#b45309", fontSize: 13 }}>
                    Place this item in your recycling or general waste bin. Do not add to compost as it may contaminate your pile.
                  </Text>
                </View>

                <TouchableOpacity onPress={handleDismiss}
                  style={{ backgroundColor: "#f3f4f6", borderRadius: 14,
                    paddingVertical: 16, alignItems: "center" }}>
                  <Text style={{ color: "#374151", fontWeight: "600", fontSize: 16 }}>
                    Got it
                  </Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}