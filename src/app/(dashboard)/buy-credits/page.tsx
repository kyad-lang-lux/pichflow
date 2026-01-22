"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyCreditsPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<number | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  const packs = [
    { id: 1, name: "Offre 1", credits: 100, price: 5, icon: "fa-seedling" },
    { id: 2, name: "Offre 2", credits: 200, price: 8, icon: "fa-rocket", popular: true },
    { id: 3, name: "Offre 3", credits: 1000, price: 20, icon: "fa-crown" },
  ];

  const handlePayment = () => {
    setIsPaying(true);
    // Simulation de l'interface de paiement (Stripe/Paypal)
    setTimeout(() => {
      setIsPaying(false);
      alert("Paiement réussi ! Vos crédits ont été ajoutés.");
      router.push('/parametres');
    }, 2500); 
  };

  return (
    <div className="settings-container">
      <button className="btn-back-link" onClick={() => router.back()}>
        <i className="fa-solid fa-chevron-left"></i> Retour
      </button>

      <div className="pricing-grid">
        {packs.map((pack) => (
          <div 
            key={pack.id} 
            className={`pricing-card ${pack.popular ? 'popular' : ''} ${selectedPack === pack.id ? 'active' : ''}`}
            onClick={() => setSelectedPack(pack.id)}
          >
            {pack.popular && <div className="popular-tag">Conseillé</div>}
            <i className={`fa-solid ${pack.icon} pack-icon`}></i>
            <h3>{pack.name}</h3>
            <span className="credit-qty">{pack.credits.toLocaleString()} crédits</span>
            <div className="price-box">
              <span className="currency">€</span>
              <span className="amount">{pack.price}</span>
            </div>
            <button className="btn-select-pack">
              {selectedPack === pack.id ? "Sélectionné" : "Choisir ce pack"}
            </button>
          </div> 
        ))}
      </div>

      {selectedPack && (
        <div className="payment-bar reveal">
          <div className="payment-info">
            <span>Total à régler : </span>
            <strong>{packs.find(p => p.id === selectedPack)?.price} €</strong>
          </div>
          <button className="btn-pay-secure" onClick={handlePayment} disabled={isPaying}>
            <i className={`fa-solid ${isPaying ? 'fa-spinner fa-spin' : 'fa-lock'}`}></i>
            {isPaying ? " Traitement en cours..." : " Payer maintenant"}
          </button>
        </div>
      )}
    </div>
  );
}