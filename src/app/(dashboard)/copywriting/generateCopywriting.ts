// /lib/googleAI.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGoogleAIModel = (systemInstruction: string) => {
  if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
    throw new Error("Clé API Google manquante.");
  }

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY);

  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction,
  });
};