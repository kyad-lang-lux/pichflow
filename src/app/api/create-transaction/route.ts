import { NextResponse } from "next/server";
import { Transaction } from "@/lib/fedapay";

export async function POST(req: Request) {
  try {
    const { amount, email, nbCredits } = await req.json();

    // 1. Vérification de sécurité des données entrantes
    if (!amount || !email || !nbCredits) {
      return NextResponse.json(
        { error: "Données manquantes pour la transaction" },
        { status: 400 }
      );
    }

    // 2. Création de la transaction dans FedaPay
    const transaction = await Transaction.create({
      description: `Achat de ${nbCredits} crédits - Pichflow`,
      amount: Math.round(amount), 
      currency: { iso: 'XOF' },
      callback_url: `https://pichflow.vercel.app/dashboard/credits?status=success`, // URL précise de retour
      customer: { 
        email: email.trim(),
        firstname: "Client", // Recommandé pour éviter des erreurs sur certains opérateurs
        lastname: "Pichflow"
      },
      // 📌 Crucial pour ton Webhook
      custom_metadata: {
        user_email: email.trim(),
        nb_credits: nbCredits
      }
    });

    // 3. Génération du token de paiement
    const tokenResponse = await transaction.generateToken();

    // 4. Vérification que l'URL existe bien dans la réponse
    if (tokenResponse && tokenResponse.url) {
      return NextResponse.json({ url: tokenResponse.url });
    } else {
      throw new Error("Lien de paiement non généré");
    }

  } catch (error: any) {
    // Log précis pour débugger dans la console Vercel
    console.error("❌ [FedaPay Error]:", error.message);
    
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement. Veuillez réessayer." },
      { status: 500 }
    );
  }
}