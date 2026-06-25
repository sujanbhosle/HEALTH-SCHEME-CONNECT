
import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY not found in environment. AI service will be limited.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });
const model = 'gemini-1.5-flash';

router.post("/chat", async (req, res) => {
  if (!API_KEY) {
    return res.json({ response: "AI service is currently not configured with an API key." });
  }

  const { history, message } = req.body;

  try {
    const contents = [...(history || []), { role: 'user', parts: [{ text: message }] }];

    // @ts-ignore - The local package @google/genai uses this pattern
    const response = await ai.models.generateContent({
        model,
        contents: contents,
        config: {
            systemInstruction: `You are 'Arogya', an advanced AI assistant for the 'Health Scheme Hub'. Your primary role is to provide accurate, empathetic, and clear information about government health schemes, empanelled hospitals, and treatment options in India.

**Core Directives:**
1. ABSOLUTELY NO MEDICAL ADVICE.
2. STAY WITHIN YOUR KNOWLEDGE BASE.
3. PROMOTE APP USAGE.`,
        },
    });

    res.json({ response: response.text });
  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

export default router;
