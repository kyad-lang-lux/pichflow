"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyCreditsPage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState(null); // Corrigé pour JS standard
  const [isPaying, setIsPaying] = useState(false);

  const packs = [
    { id: 1, name: "Offre Débutant", credits: 100, price: 5, icon: "fa-seedling" },
    { id: 2, name: "Pack Croissance", credits: 200, price: 8, icon: "fa-rocket", popular: true },
    { id: 3, name: "Pack Business", credits: 1000, price: 20, icon: "fa-crown" },
  ];

  const handlePayment = () => {
    if (!selectedPack) return;
    setIsPaying(true);
    
    // Simulation du paiement
    setTimeout(() => {
      setIsPaying(false);
      alert("Paiement réussi ! Vos crédits ont été ajoutés.");
      router.push('/parametres'); // Assure-toi que cette route existe
    }, 2500); 
  };

  return (
    <div className="credits-page-container">
      <div className="credits-header">
        <button className="back-btn" onClick={() => router.back()}>
          <i className="fa-solid fa-arrow-left"></i> Retour
        </button>
        <h1>Acheter des crédits</h1>
        <p>Choisissez le pack qui correspond à vos besoins de croissance.</p>
      </div>

      <div className="credits-grid-layout">
        {packs.map((pack) => (
          <div 
            key={pack.id} 
            className={`credit-pack-card ${pack.popular ? 'is-popular' : ''} ${selectedPack === pack.id ? 'is-selected' : ''}`}
            onClick={() => setSelectedPack(pack.id)}
          >
            {pack.popular && <div className="popular-ribbon">Le plus choisi</div>}
            
            <div className="pack-icon-wrapper">
               <i className={`fa-solid ${pack.icon}`}></i>
            </div>
            
            <h3>{pack.name}</h3>
            <div className="credit-amount">{pack.credits.toLocaleString()} crédits</div>
            
            <div className="pack-price">
              <span className="price-val">{pack.price}€</span>
            </div>

            <button className="select-box-btn">
              {selectedPack === pack.id ? "Pack Sélectionné" : "Choisir ce pack"}
            </button>
          </div> 
        ))}
      </div>

      {selectedPack && (
        <div className="fixed-checkout-bar">
          <div className="checkout-content">
            <div className="total-text">
              Total : <span>{packs.find(p => p.id === selectedPack)?.price} €</span>
            </div>
            <button className="final-pay-btn" onClick={handlePayment} disabled={isPaying}>
              {isPaying ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> Traitement...</>
              ) : (
                <><i className="fa-solid fa-shield-halved"></i> Payer en toute sécurité</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}