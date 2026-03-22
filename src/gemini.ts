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
      `What is this object? Is it compostable?
       Reply in JSON only, no extra text, with these exact fields:
       {
         "item": "apple core",
         "compostable": true,
         "reason": "organic fruit waste breaks down easily",
         "cn_ratio": 15,
         "decomp_weeks": 4,
         "methane": "low"
       }
       cn_ratio: carbon-to-nitrogen ratio as an integer (e.g. 20-80).
       decomp_weeks: estimated weeks to decompose as an integer.
       methane: "low" or "high" based on methane emission potential.
       If not compostable, still fill in cn_ratio, decomp_weeks, methane with realistic values for the material.`
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
