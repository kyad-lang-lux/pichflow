import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAIContent(prompt: string, systemInstructions: string) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
    throw new Error("Clé API Google manquante.");
  }

  const genAI = new GoogleGenerativeAI(
    process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    systemInstruction: systemInstructions,
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}