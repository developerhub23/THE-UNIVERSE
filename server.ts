import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API proxy route for Gemini chat
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, message, contents } = req.body;
    let promptText = "";

    if (prompt) {
      promptText = prompt;
    } else if (message) {
      promptText = message;
    } else if (contents && Array.isArray(contents)) {
      // Reconstruct promptText from contents format if provided
      const lastContent = contents[contents.length - 1];
      if (lastContent && lastContent.parts && Array.isArray(lastContent.parts)) {
        promptText = lastContent.parts.map((p: any) => p.text || "").join(" ");
      }
    }

    if (!promptText) {
      return res.status(400).json({ error: "No prompt text provided" });
    }

    // Lazy load the Gemini client and verify the API key exists
    const ai = getGeminiClient();

    // Call Gemini API using gemini-3.5-flash as the standard text task model
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: "You are a NASA-level space exploration AI assistant. Keep responses engaging, informative, and scientifically accurate.",
      },
    });

    const replyText = response.text || "I'm sorry, I couldn't generate a response.";

    // Send the response in both the direct text format and the structure the client expects
    res.json({
      text: replyText,
      candidates: [
        {
          content: {
            parts: [
              {
                text: replyText,
              },
            ],
          },
        },
      ],
    });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
      text: "Sorry, I had trouble connecting to the space intelligence systems right now.",
    });
  }
});

// Serve static assets
const isProduction = process.env.NODE_ENV === "production";
const publicPath = isProduction
  ? path.join(process.cwd(), "dist")
  : path.join(process.cwd(), ".");

app.use(express.static(publicPath));

// Fallback to index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
