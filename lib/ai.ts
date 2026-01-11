import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
export const ai = new GoogleGenAI({ apiKey });
