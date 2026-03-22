import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from "expo-file-system/legacy";

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_KEY!);

export async function analyzeItem(photoUri: string) {
  try {
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: "base64",
    });

    const model = genAI.getGenerativeModel(
      { model: "gemini-2.5-flash" },
      { apiVersion: "v1beta" }
    );

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64,
        },
      },
      `You are a composting expert. Identify the main object in this image.
       Reply in JSON only, no extra text, no markdown:
       { "item": "apple core", "compostable": true, "reason": "organic waste breaks down easily", "cn_ratio": 15 }
       The cn_ratio must be a number representing the carbon-to-nitrogen ratio (e.g. apple core=15, cardboard=350, grass=20, leaves=60). If not compostable use 0.`
    ]);

    const text = result.response.text();
    console.log("Gemini response:", text);
    return JSON.parse(text.replace(/```json|```/g, "").trim());

  } catch (e) {
    console.error("Gemini error:", e);
    return { item: "unknown", compostable: false, reason: "Could not analyze image" };
  }
}

export default {};
