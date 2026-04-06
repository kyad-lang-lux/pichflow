"use client";
import React, { useState, useEffect } from 'react';
import { saveSenderInfoAction, getSenderInfo } from './senderAction';

export default function FactureInfoPage() {
  const [info, setInfo] = useState({ 
    nomService: '', 
    adresse: '', 
    contact: '', 
    tvaRate: 0 // Nouvel état
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getSenderInfo();
      if (data) {
        setInfo({
          nomService: (data.nomService as string) || '',
          adresse: (data.adresse as string) || '',
          contact: (data.contact as string) || '',
          tvaRate: Number(data.tvaRate) || 0 // Récupération
        });
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await saveSenderInfoAction({
      nom_service: info.nomService,
      adresse: info.adresse,
      contact: info.contact,
      tva_rate: info.tvaRate // Envoi au serveur
    });

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      alert("Erreur lors de la sauvegarde");
    }
    setLoading(false);
  };

  if (loading && info.nomService === '') return <div style={{padding: "20px"}}>Chargement...</div>;

  return (
    <div className="fi-wrapper">
      <div className="fi-header">
        <h1>Facturation</h1>
        <p>Veuillez remplir les infos d'emetteurs qui seront sur vos factures:
          Infos de l'émetteur et configuration fiscale. </p>
      </div>

      <div className="fi-main-layout">
        <div className="fi-form-section">
          <section className="fi-card">
            <div className="fi-card-title">
              <i className="fa-solid fa-pen"></i> Informations
            </div>
            <form onSubmit={handleSave} className="fi-form">
              <div className="fi-field">
                <label>Nom du Service</label>
                <input 
                  type="text" 
                  value={info.nomService} 
                  onChange={(e)=>setInfo({...info, nomService: e.target.value})} 
                  required 
                  placeholder="Ex: Pichflow Agency"
                />
              </div>
              <div className="fi-field">
                <label>Adresse</label>
                <input 
                  type="text" 
                  value={info.adresse} 
                  onChange={(e)=>setInfo({...info, adresse: e.target.value})} 
                  required 
                  placeholder="Ex: 12 Rue des Fleurs, 75008 Paris, France"
                />
              </div>
              <div className="fi-field">
                <label>Contact (Email/Tél)</label>
                <input 
                  type="text" 
                  value={info.contact} 
                  onChange={(e)=>setInfo({...info, contact: e.target.value})} 
                  required 
                  placeholder="Ex: contact@pichflow.com"
                />
              </div>

              {/* --- NOUVEAU CHAMP TVA --- */}
              <div className="fi-field">
                <label>Taux de TVA par défaut (%)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={info.tvaRate} 
                  onChange={(e)=>setInfo({...info, tvaRate: parseFloat(e.target.value) || 0})} 
                  required 
                  placeholder="Ex: 18 ou 20"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`fi-btn-save ${saved ? 'success' : ''}`}
              >
                {loading ? "..." : (saved ? "Enregistré !" : "Sauvegarder")}
              </button>
            </form>
          </section>
        </div>

        <div className="fi-preview-section">
          <section className="fi-card">
            <div className="fi-card-title">
              <i className="fa-solid fa-eye"></i> Aperçu émetteur
            </div>
            <div className="fi-preview-box">
              <h2 style={{ textTransform: 'uppercase', color: '#000', marginBottom: '10px' }}>
                {info.nomService || "NOM DU SERVICE"}
              </h2>
              <div style={{ color: '#555', fontSize: '14px' }}>
                <p><strong>📍</strong> {info.adresse || "Adresse..."}</p>
                <p><strong>📞</strong> {info.contact || "Contact..."}</p>
                <p style={{ marginTop: '10px', color: '#000', fontWeight: 'bold' }}>
                   Taxe : {info.tvaRate}% (Appliquée sur les documents)
                </p>
              </div>
            </div> 
          </section>
        </div> 
      </div>
      <br /> <br /> <br />
    </div>
  );
}