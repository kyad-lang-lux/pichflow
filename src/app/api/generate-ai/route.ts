import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// On initialise l'IA avec ta clé (AIza...)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

export const maxDuration = 60; // Indispensable pour éviter les timeouts sur Vercel

export async function POST(req: Request) {
  try {
    const { prompt, systemPrompt } = await req.json();

    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json({ error: "Clé API manquante dans le fichier .env" }, { status: 500 });
    }

    // On utilise le modèle Gratuit & Puissant de ta liste
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      // On donne les instructions de rôle ici (System Prompt)
      systemInstruction: systemPrompt || "Tu es un expert en marketing et copywriting pour Pichflow."
    });

    // Lancement de la génération
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // On renvoie le texte propre au frontend
    return NextResponse.json({ content: text });

  } catch (error: any) {
    console.error("ERREUR GOOGLE AI:", error);
    
    // Message d'erreur clair si le quota gratuit est atteint
    if (error.message?.includes("429")) {
        return NextResponse.json({ error: "Trop de requêtes. Attendez une minute." }, { status: 429 });
    }

    return NextResponse.json({ error: "L'IA a eu un petit bug, réessayez !" }, { status: 500 });
  }
}