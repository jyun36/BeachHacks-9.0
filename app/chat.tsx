import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useState, useRef, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getPile, PileItem } from "../src/pileStore";

const AGENT_URL = "https://adrianna-intercrural-behaviorally.ngrok-free.dev/chat";

type Message = { role: "user" | "agent"; text: string };

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", text: "Hi! Ask me anything about composting or your pile." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pile, setPile] = useState<PileItem[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(useCallback(() => {
    getPile().then(setPile);
  }, []));

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const timeout = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), 8000)
      );
      const data: any = await Promise.race([
        fetch(AGENT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" },
          body: JSON.stringify({
            message: text,
            items: pile.map(i => ({ item: i.item, cn_ratio: i.cn_ratio, decomp_weeks: i.decomp_weeks, methane: i.methane })),
          }),
        }).then(r => r.json()),
        timeout,
      ]);
      setMessages(prev => [...prev, { role: "agent", text: data.reply || "Sorry, I couldn't get a response." }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", text: "Agent is offline. Make sure it's running." }]);
    }
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.agentAvatar}>
          <Ionicons name="leaf" size={20} color="#fff" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Compost Assistant</Text>
          <Text style={styles.headerSub}>Powered by Fetch.ai + Gemini</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, i) => (
          <View key={i} style={[styles.bubble, msg.role === "user" ? styles.userBubble : styles.agentBubble]}>
            <Text style={[styles.bubbleText, msg.role === "user" ? styles.userText : styles.agentText]}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.agentBubble}>
            <Text style={styles.agentText}>Thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 12 }]}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your compost pile..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={sendMessage} disabled={loading} style={styles.sendBtn}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f0fdf4" },

  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#fff", paddingHorizontal: 16, paddingBottom: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 4,
  },
  agentAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#059669", justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  headerSub: { fontSize: 11, color: "#6b7280" },

  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 10 },

  bubble: { maxWidth: "80%", borderRadius: 16, padding: 12 },
  agentBubble: { backgroundColor: "#fff", alignSelf: "flex-start", borderBottomLeftRadius: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  userBubble: { backgroundColor: "#059669", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  agentText: { color: "#111827" },
  userText: { color: "#fff" },

  inputRow: {
    flexDirection: "row", gap: 10, paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f3f4f6",
  },
  input: {
    flex: 1, backgroundColor: "#f3f4f6", borderRadius: 24,
    paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: "#111827",
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#059669", justifyContent: "center", alignItems: "center",
  },
});
