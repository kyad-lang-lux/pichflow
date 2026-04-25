"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUserEmail } from "@/app/actions/auth";

// Configuration devises
interface CurrencyConfig {
  symbol: string;
  rate: number;
  label: string;
  symbolAfter?: boolean;
}

const pricingConfig: Record<string, CurrencyConfig> = {
  EUR: { symbol: "€", rate: 1, label: "EUR", symbolAfter: true },
  XOF: { symbol: " FCFA", rate: 655.957, label: "XOF", symbolAfter: true },
  XAF: { symbol: " FCFA", rate: 655.957, label: "XAF", symbolAfter: true },
  USD: { symbol: "$", rate: 1.08, label: "USD", symbolAfter: false },
  GBP: { symbol: "£", rate: 0.86, label: "GBP", symbolAfter: false },
  CAD: { symbol: "CA$", rate: 1.48, label: "CAD", symbolAfter: false },
  MAD: { symbol: " DH", rate: 10.95, label: "MAD", symbolAfter: true },
  GNF: { symbol: " FG", rate: 9300, label: "GNF", symbolAfter: true },
};

export default function BuyCreditsPage() {
  const router = useRouter();

  const [selectedPack, setSelectedPack] = useState<number>(0);
  const [isPaying, setIsPaying] = useState(false);
  const [currency, setCurrency] = useState<CurrencyConfig>(
    pricingConfig["EUR"]
  );

    const [userEmail, setUserEmail] = useState<string | null>(null);

  // 🌍 Détection devise automatique
    // 🌍 Détection devise automatique + récupération email utilisateur
  useEffect(() => {
    async function initializePage() {
      try {
        // Récupération de l'email utilisateur
        const email = await getCurrentUserEmail();
        setUserEmail(email);

        // Détection devise
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        const suggested = data.currency;

        if (pricingConfig[suggested]) {
          setCurrency(pricingConfig[suggested]);
        } else if (data.continent_code === "AF") {
          setCurrency(pricingConfig["XOF"]);
        }
      } catch (error) {
        console.error("Erreur initialisation:", error);
      }
    }

    initializePage();
  }, []);

  // 💱 Format prix
  const formatPrice = (euroAmount: number): string => {
    const converted = Math.round(euroAmount * currency.rate);
    const formatted = converted.toLocaleString("fr-FR");

    return currency.symbolAfter
      ? `${formatted}${currency.symbol}`
      : `${currency.symbol}${formatted}`;
  };

  // 📦 Packs crédits
  const packs = [
    {
      id: 1,
      name: "Offre Débutant",
      credits: 80,
      price: 1.525,
      icon: "fa-seedling",
    },
    {
      id: 2,
      name: "Pack Croissance",
      credits: 200,
      price: 2.438,
      icon: "fa-rocket",
      popular: true,
    },
  ];

  // 💳 Paiement FedaPay
 // 💳 Paiement FedaPay
  const handlePayment = async () => {
    if (selectedPack === 0) return;

    setIsPaying(true);

    try {
      const pack = packs.find((p) => p.id === selectedPack);
      if (!pack) return;

      const amount = Math.round(pack.price * currency.rate);

      // 💡 ICI : Remplace par l'email de ton utilisateur connecté (ex: session.user.email)
            // Récupération de l'email utilisateur connecté
      const customerEmail = userEmail; 

      const res = await fetch("/api/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
          amount,
          email: customerEmail,
          nbCredits: pack.credits,
          currency: currency.label // Ajoute cette ligne
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Impossible de générer le lien de paiement.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors du paiement.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="credits-page-container">
      {/* HEADER */}
      <div className="credits-header">
        <button className="back-btn" onClick={() => router.back()}>
          <i className="fa-solid fa-arrow-left"></i> Retour
        </button>

        <h1>Acheter des crédits</h1>
        <p>Prix adaptés à votre devise ({currency.label}).</p>
      </div>

      {/* PACKS */}
      <div className="credits-grid-layout">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className={`credit-pack-card ${
              pack.popular ? "is-popular" : ""
            } ${selectedPack === pack.id ? "is-selected" : ""}`}
            onClick={() => setSelectedPack(pack.id)}
          >
            {pack.popular && (
              <div className="popular-ribbon">Le plus choisi</div>
            )}

            <div className="pack-icon-wrapper">
              <i className={`fa-solid ${pack.icon}`}></i>
            </div>

            <h3>{pack.name}</h3>

            <div className="credit-amount">
              {pack.credits.toLocaleString()} crédits
            </div>

            <div className="pack-price">
              <span className="price-val">
                {formatPrice(pack.price)}
              </span>
            </div>

            <button type="button" className="select-box-btn">
              {selectedPack === pack.id
                ? "Pack Sélectionné"
                : "Choisir ce pack"}
            </button>
          </div>
        ))}
      </div>

      {/* BARRE FIXE PAIEMENT */}
      {selectedPack !== 0 && (
        <div className="fixed-checkout-bar">
          <div className="checkout-content">
            <div className="total-text">
              Total :
              <span>
                {formatPrice(
                  packs.find((p) => p.id === selectedPack)?.price || 0
                )}
              </span>
            </div>

                        <button
              className="final-pay-btn"
              onClick={handlePayment}
              disabled={isPaying || !userEmail}
            >
              {isPaying ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i> Traitement...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-halved"></i> Payer en{" "}
                  {currency.label}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}