import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());

// Lazy-initialized Gemini Client helper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in your .env.local file.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "THE-UNIVERSE-app",
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

    if (!promptText || typeof promptText !== 'string') {
      return res.status(400).json({ 
        error: "No valid prompt text provided",
        text: "Please provide a valid message or prompt."
      });
    }

    // Sanitize input - basic protection against injection
    const sanitizedPrompt = promptText.trim().substring(0, 10000); // Limit to 10k characters
    if (!sanitizedPrompt) {
      return res.status(400).json({ 
        error: "Prompt is empty after sanitization",
        text: "Please provide a non-empty message."
      });
    }

    // Lazy load the Gemini client and verify the API key exists
    const ai = getGeminiClient();

    // Call Gemini API using gemini-1.5-flash as the standard text task model
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: sanitizedPrompt,
      config: {
        systemInstruction: "You are a NASA-level space exploration AI assistant. Keep responses engaging, informative, and scientifically accurate. Always respond in a friendly, helpful manner.",
        temperature: 0.7,
        maxOutputTokens: 2048,
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
    
    // Provide more specific error messages
    let errorMessage = "Internal Server Error";
    let userMessage = "Sorry, I had trouble connecting to the space intelligence systems right now.";
    
    if (error.message && error.message.includes("GEMINI_API_KEY")) {
      errorMessage = "API Key Not Configured";
      userMessage = "Server is not configured with a Gemini API key. Please set the GEMINI_API_KEY environment variable.";
    } else if (error.message && error.message.includes("401")) {
      errorMessage = "Unauthorized";
      userMessage = "The API key is invalid or has been revoked. Please check your GEMINI_API_KEY.";
    } else if (error.message && error.message.includes("403")) {
      errorMessage = "Forbidden";
      userMessage = "Access denied. Please check your API key permissions.";
    } else if (error.message && error.message.includes("429")) {
      errorMessage = "Rate Limited";
      userMessage = "Too many requests. Please try again in a moment.";
    } else if (error.code === 'ENOTFOUND' || error.message?.includes('fetch')) {
      errorMessage = "Network Error";
      userMessage = "Unable to connect to the AI service. Please check your internet connection.";
    }
    
    res.status(error.message?.includes("GEMINI_API_KEY") ? 400 : 500).json({
      error: errorMessage,
      text: userMessage,
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date().toISOString(),
    hasApiKey: !!process.env.GEMINI_API_KEY
  });
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
  if (!process.env.GEMINI_API_KEY) {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI chat functionality will not work.");
  }
});
