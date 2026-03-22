import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
  // Layout
  container:        { flex: 1, backgroundColor: "black" },
  cameraContainer:  { flex: 1 },
  camera:           { flex: 1 },

  // Leaf button (top is dynamic — set via style array)
  leafBtn: {
    position: "absolute",
    left: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#059669",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },

  // Scan overlay
  overlayWrapper: {
    position: "absolute",
    top: 200,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scanBox: {
    width: 250,
    height: 250,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  cornerTL: { position: "absolute", top: 0, left: 0,   width: 40, height: 40, borderTopWidth: 4,    borderLeftWidth: 4,  borderColor: "white" },
  cornerTR: { position: "absolute", top: 0, right: 0,  width: 40, height: 40, borderTopWidth: 4,    borderRightWidth: 4, borderColor: "white" },
  cornerBL: { position: "absolute", bottom: 0, left: 0,  width: 40, height: 40, borderBottomWidth: 4, borderLeftWidth: 4,  borderColor: "white" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 40, height: 40, borderBottomWidth: 4, borderRightWidth: 4, borderColor: "white" },

  analyzingText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "black",
    textShadowRadius: 4,
  },
  resultItemCenter: { alignItems: "center" },
  resultEmoji:      { fontSize: 20, marginTop: 4 },

  // Shutter
  shutterWrapper: { position: "absolute", bottom: 80, left: 0, right: 0, alignItems: "center" },
  shutterBtn:     { width: 70, height: 70, borderRadius: 35, backgroundColor: "white", borderWidth: 4, borderColor: "#ccc" },

  // Modals shared
  modalBackdrop:  { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalSheet:     { backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  resultSheet:    { backgroundColor: "white", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28 },

  // Tasks modal header
  tasksHeader:      { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  tasksHeaderIcon:  { width: 42, height: 42, borderRadius: 21, backgroundColor: "#059669", justifyContent: "center", alignItems: "center", marginRight: 12 },
  tasksTitle:       { fontSize: 18, fontWeight: "800", color: "#111827" },
  tasksSubtitle:    { fontSize: 12, color: "#6b7280" },

  // Task card
  taskCard:         { backgroundColor: "#f9fafb", borderRadius: 14, padding: 14, marginBottom: 10 },
  taskCardRow:      { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  taskCardIcon:     { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 10 },
  taskCardText:     { flex: 1 },
  taskCardTitle:    { fontWeight: "700", color: "#111827", fontSize: 14 },
  taskCardDesc:     { color: "#6b7280", fontSize: 12 },
  progressTrack:    { height: 6, backgroundColor: "#e5e7eb", borderRadius: 3 },

  // Score card
  scoreRow:         { flexDirection: "row", alignItems: "center" },
  scoreIconWrap:    { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 10 },
  scoreTextWrap:    { flex: 1 },
  scoreTitle:       { fontWeight: "700", color: "#111827", fontSize: 14 },
  scoreDesc:        { color: "#6b7280", fontSize: 12 },
  scoreValue:       { fontWeight: "800", fontSize: 18 },

  // Agent tips
  tipsBox:          { backgroundColor: "#f0fdf4", borderRadius: 12, padding: 14, marginTop: 4 },
  tipsHeader:       { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  tipsTitle:        { fontWeight: "700", color: "#065f46", fontSize: 13 },
  tipText:          { color: "#047857", fontSize: 12 },

  // Chat button (in tasks modal)
  chatBtn:             { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#059669", borderRadius: 14, paddingVertical: 14, marginTop: 12 },
  chatBtnText:         { color: "white", fontWeight: "700", fontSize: 15, marginLeft: 8 },

  // Chat screen
  chatScreen:          { flex: 1, backgroundColor: "white" },
  chatHeader:          { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
  chatAvatarWrap:      { width: 40, height: 40, borderRadius: 20, backgroundColor: "#059669", justifyContent: "center", alignItems: "center", marginRight: 10 },
  chatHeaderName:      { fontSize: 16, fontWeight: "800", color: "#111827" },
  chatHeaderSub:       { fontSize: 11, color: "#6b7280" },
  chatMessages:        { flex: 1 },
  chatContent:         { padding: 16, paddingBottom: 8 },
  bubbleUser:          { alignSelf: "flex-end", backgroundColor: "#059669", borderRadius: 18, borderBottomRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, maxWidth: "80%" },
  bubbleAgent:         { alignSelf: "flex-start", backgroundColor: "#f3f4f6", borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8, maxWidth: "80%" },
  bubbleUserText:      { color: "white", fontSize: 14, lineHeight: 20 },
  bubbleAgentText:     { color: "#111827", fontSize: 14, lineHeight: 20 },
  typingBubble:        { alignSelf: "flex-start", backgroundColor: "#f3f4f6", borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 8 },
  typingText:          { color: "#9ca3af", fontSize: 13, fontStyle: "italic" },
  suggestionsRow:      { paddingHorizontal: 12, paddingVertical: 8 },
  suggestionChip:      { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#6ee7b7", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  suggestionChipText:  { color: "#065f46", fontSize: 12, fontWeight: "600" },
  chatInputRow:        { flexDirection: "row", alignItems: "flex-end", padding: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb", backgroundColor: "white" },
  chatInput:           { flex: 1, backgroundColor: "#f3f4f6", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: "#111827", marginRight: 8, maxHeight: 100 },
  chatSendBtn:         { width: 42, height: 42, borderRadius: 21, backgroundColor: "#059669", justifyContent: "center", alignItems: "center" },
  chatSendBtnOff:      { width: 42, height: 42, borderRadius: 21, backgroundColor: "#d1fae5", justifyContent: "center", alignItems: "center" },

  // Permission screen
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  permissionText:      { color: "white", marginBottom: 20 },
  permissionBtn:       { padding: 12, backgroundColor: "green", borderRadius: 8 },
  permissionBtnText:   { color: "white" },

  // Result modal — compostable
  resultEmojiBig:   { fontSize: 48, textAlign: "center" },
  resultTitleGreen: { fontSize: 22, fontWeight: "bold", color: "#059669", textAlign: "center", marginTop: 8 },
  resultTitleRed:   { fontSize: 22, fontWeight: "bold", color: "#dc2626", textAlign: "center", marginTop: 8 },
  resultItem:       { fontSize: 16, fontWeight: "600", color: "#111827", textAlign: "center", marginTop: 4 },
  resultReason:     { fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 8, marginBottom: 24 },
  resultReasonNoMb: { fontSize: 14, color: "#6b7280", textAlign: "center", marginTop: 8 },
  addBtn:           { backgroundColor: "#059669", borderRadius: 14, paddingVertical: 16, alignItems: "center", marginBottom: 12 },
  addBtnText:       { color: "white", fontWeight: "bold", fontSize: 16 },
  skipBtn:          { backgroundColor: "#f3f4f6", borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  skipBtnText:      { color: "#374151", fontWeight: "600", fontSize: 16 },
  disposeBox:       { backgroundColor: "#fef3c7", borderRadius: 12, padding: 16, marginTop: 16, marginBottom: 24 },
  disposeTitle:     { fontWeight: "600", color: "#92400e", marginBottom: 4 },
  disposeText:      { color: "#b45309", fontSize: 13 },
});
