import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client Lazily/Safely as instructed by safety guidelines
let globAiClient: any = null;

function getGeminiClient() {
  if (!globAiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    globAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return globAiClient;
}

// Host health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// AI Query Endpoint
app.post("/api/gemini/query", async (req, res) => {
  try {
    const { prompt, queryType } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided" });
    }

    const ai = getGeminiClient();

    // Custom system instruction depending on the tab/queryType
    let sysInstruction = "You are CricMind AI, a state-of-the-art futuristic cricket intelligence node. " +
      "Analyze the user's inquiry on Indian Premier League (IPL) and international cricket. " +
      "Provide complete step-by-step expert reasoning, tactical parameters (form, pitch, toss match-ups, venue stats), " +
      "and fully detailed squads if a fantasy team is requested. Keep your responses structured with clean markdown, " +
      "tables, and futuristic sections. Give realistic probabilities and recommendations.";

    if (queryType === "fantasy") {
      sysInstruction += " Strictly focus on compiling a highly optimized Fantasy Dream XI with 11 players. " +
        "Suggest 1 Captain and 1 Vice-Captain with strategic reasons. Format playing combinations in a Markdown table " +
        "specifying Player Name, Team, Role, Recent Form/Form Grade, and Fantasy Rating (1-10 scale).";
    } else if (queryType === "prediction") {
      sysInstruction += " Focus on match result prediction of the specified teams. Provide a relative probability map " +
        "(e.g. CSK 55% vs RCB 45%), analyze pitch and toss advantages, and forecast key game-changing parameters. Be definitive yet analytical.";
    } else if (queryType === "analysis") {
      sysInstruction += " Focus heavily on the tactical analysis of the specified player (style, historical performance against the opponent, pitch record, current form index). Summarize as a Player profile highlighting core strengths, weaknesses, and a grade rating.";
    } else if (queryType === "insights") {
      sysInstruction += " Focus on detailed structural match pre-analyses, pitch reports, ground details, weather factors, and tactical head-to-head match-ups.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: sysInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "No insights generated.";
    
    // Extract Grounding Chunks with web links
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceLinks = groundingChunks.map((chunk: any) => {
      if (chunk.web) {
        return {
          title: chunk.web.title,
          uri: chunk.web.uri
        };
      }
      return null;
    }).filter(Boolean);

    res.json({
      success: true,
      response: text,
      sources: sourceLinks,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("Gemini Query Critical Error: ", error);
    res.status(500).json({
      success: false,
      error: error.message || "An unexpected error occurred in CricMind AI engine."
    });
  }
});

// Setup Vite Dev Middleware / Production static file delivery
async function buildApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CricMind AI Server running on port ${PORT}`);
  });
}

buildApp();
