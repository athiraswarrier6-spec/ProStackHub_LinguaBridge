import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/api/translate", async (req, res) => {
  try {
    const { text, sourceLanguage, targetLanguage } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Please enter some text to translate.",
      });
    }

    const isAutoDetect = sourceLanguage === "Auto Detect";

    let prompt;

    if (isAutoDetect) {
      prompt = `
Detect the language of the following text and translate it into ${targetLanguage}.

Return your response in exactly this format:

DETECTED_LANGUAGE: <language name>
TRANSLATION:
<translated text>

Requirements:
- Detect the actual source language.
- Preserve all line breaks.
- Preserve punctuation.
- Preserve numbered and bulleted lists.
- Preserve paragraph structure.
- Do not add explanations.
- Return only the required format.

Text:
${text}
`;
    } else {
      prompt = `
Translate the following text from ${sourceLanguage} to ${targetLanguage}.

Requirements:
- Preserve all line breaks.
- Preserve punctuation.
- Preserve numbered and bulleted lists.
- Preserve paragraph structure.
- Do not add explanations or extra text.
- Return only the translated text.

Text:
${text}
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const result = response.text?.trim();

    if (!result) {
      throw new Error("Gemini returned an empty response.");
    }

    if (isAutoDetect) {
      const languageMatch = result.match(
        /DETECTED_LANGUAGE:\s*(.+?)(?:\r?\n|$)/i
      );

      const translationMatch = result.match(
        /TRANSLATION:\s*([\s\S]*)/i
      );

      const detectedLanguage = languageMatch
        ? languageMatch[1].trim()
        : "Auto Detect";

      const translatedText = translationMatch
        ? translationMatch[1].trim()
        : result;

      return res.json({
        translatedText,
        detectedLanguage,
      });
    }

    res.json({
      translatedText: result,
      detectedLanguage: sourceLanguage,
    });
  } catch (error) {
    console.error("Translation error:", error);

    res.status(500).json({
      error: "Translation failed. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`LinguaBridge server running on http://localhost:${PORT}`);
});