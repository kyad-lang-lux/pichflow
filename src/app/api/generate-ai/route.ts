// /app/api/generate-ai/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialisation du client avec ta clé API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Limite max pour éviter timeout Vercel
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: "Clé API manquante sur Vercel." },
        { status: 500 }
      );
    }

    // ✅ On utilise le modèle qui fonctionne pour generateContent
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      systemInstruction:
        systemPrompt || "Tu es un expert en marketing et copywriting pour Pichflow.",
    });

    // Génération du contenu
    const result = await model.generateContent(prompt);
    const text = (await result.response).text();

    // Retour du texte au frontend
    return NextResponse.json({ content: text });

  } catch (error: any) {
    console.error("ERREUR GOOGLE AI:", error);

    // Gestion des quotas / trop de requêtes
    if (error.message?.includes("429")) {
      return NextResponse.json(
        { error: "Trop de requêtes. Patientez quelques secondes." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur IA." },
      { status: 500 }
    );
  }
}

