import { NextResponse } from "next/server";
import { Transaction } from "@/lib/fedapay";

export async function POST(req: Request) {
  try {
    const { amount, email, nbCredits, currency } = await req.json();

        // Déterminer l'URL de base selon l'environnement
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    // 1. Vérification de sécurité des données entrantes
    if (!amount || !email || !nbCredits) {
      return NextResponse.json(
        { error: "Données manquantes pour la transaction" },
        { status: 400 },
      );
    }

    // 2. Création de la transaction dans FedaPay
    // 2. Création de la transaction dans FedaPay
    const transaction = await Transaction.create({
      description: `Achat de ${nbCredits} crédits - Pichflow`,
      amount: Math.round(amount),
      currency: { iso: currency || "XOF" }, // Utilise la devise passée ou XOF par défaut
      callback_url: `${baseUrl}/buy-credits?status=success`,
      customer: {
        email: email.trim(),
        firstname: "Client",
        lastname: "Pichflow",
      },
      custom_metadata: {
        user_email: email.trim(),
        nb_credits: nbCredits,
      },
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
      { status: 500 },
    );
  }
}
