"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyCreditsPage() {
  const router = useRouter();
  
  // SOLUTION : On utilise une assertion de type ou une union de types
  // Si tu es en .tsx : useState<number | null>(null)
  // Si tu es en .js mais que le linter râle :
  const [selectedPack, setSelectedPack] = useState(0); 

  const [isPaying, setIsPaying] = useState(false);

  const packs = [
    { id: 1, name: "Offre Débutant", credits: 100, price: 5, icon: "fa-seedling" },
    { id: 2, name: "Pack Croissance", credits: 200, price: 8, icon: "fa-rocket", popular: true },
    { id: 3, name: "Pack Business", credits: 1000, price: 20, icon: "fa-crown" },
  ];

  const handlePayment = () => {
    // On vérifie si selectedPack est différent de 0 (notre valeur par défaut)
    if (selectedPack === 0) return;
    setIsPaying(true);
    
    setTimeout(() => {
      setIsPaying(false);
      alert("Paiement réussi ! Vos crédits ont été ajoutés.");
      router.push('/parametres'); 
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
            // Maintenant setSelectedPack accepte le nombre sans erreur !
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

            <button type="button" className="select-box-btn">
              {selectedPack === pack.id ? "Pack Sélectionné" : "Choisir ce pack"}
            </button>
          </div> 
        ))}
      </div>

      {/* On affiche la barre seulement si un pack est sélectionné (différent de 0) */}
      {selectedPack !== 0 && (
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