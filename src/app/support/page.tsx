"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const faqs = [
    { q: "Comment fonctionne l'essai gratuit ?", a: "Vous bénéficiez de 7 jours d'accès total à l'IA marketing et aux outils financiers. Aucune carte bancaire n'est demandée." },
    { q: "Puis-je exporter mes factures en PDF ?", a: "Absolument. Toutes vos factures et rapports de comptabilité sont téléchargeables au format PDF professionnel en un clic." },
    { q: "Est-ce adapté pour une petite entreprise ?", a: "Oui, PichFlow est conçu spécifiquement pour simplifier la vie des freelances, créateurs et PME qui veulent tout gérer au même endroit." }
  ];

  return (
    <div className="sup-wrapper">
      <div className="sup-container">
        
        {/* En-tête */}
        <br /><br /> 
        <div className="sup-header">
          <span className="sup-tag">Assistance PichFlow</span>
          <h1>Besoin d'un <span>coup de main ?</span></h1>
          <p>Trouvez une réponse immédiate ou contactez notre équipe technique.</p>
        </div>

        <div className="sup-grid">
          
          {/* Section FAQ avec boutons + et - explicites */}
          <div className="sup-faq">
            <h2 className="sup-title">Questions fréquentes</h2>
            <div className="faq-stack">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-box ${activeTab === index ? 'open' : ''}`}
                  onClick={() => setActiveTab(activeTab === index ? null : index)}
                >
                  <div className="faq-top">
                    <span className="faq-q">{faq.q}</span>
                    <div className="faq-icon-wrapper">
                      {activeTab === index ? (
                        <i className="fa-solid fa-minus"></i>
                      ) : (
                        <i className="fa-solid fa-plus"></i>
                      )}
                    </div>
                  </div>
                  <div className="faq-bottom">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulaire stylisé */}
          <div className="sup-form-section">
            <div className="form-card">
              <h2 className="sup-title">Envoyez-nous un message</h2>
              <form className="custom-form">
                <div className="field">
                  <label>Nom complet</label>
                  <input type="text" placeholder="Ex: Jean Dupont" />
                </div>
                
                <div className="field">
                  <label>Email professionnel</label>
                  <input type="email" placeholder="jean@exemple.com" />
                </div>

                <div className="field">
                  <label>Votre demande</label>
                  <textarea rows={4} placeholder="Comment pouvons-nous vous aider ?"></textarea>
                </div>

                <button type="submit" className="sup-btn">
                  Envoyer le ticket <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}