import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState } from "react";
import { Text, View, TouchableOpacity, Image, ScrollView } from "react-native";

export default function Index() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState<string[]>([]);
  const cameraRef = useRef<CameraView>(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      if (photo?.uri) {
        setPhotos((prev) => [photo.uri, ...prev]);
      }
    }
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

        {/* Corner overlay */}
        <View style={{ position: "absolute", top: 100, left: 0, right: 0,
        alignItems: "center", pointerEvents: "none" }}>
          <View style={{ width: 250, height: 250, position: "relative" }}>
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

    </View>
  );
}
