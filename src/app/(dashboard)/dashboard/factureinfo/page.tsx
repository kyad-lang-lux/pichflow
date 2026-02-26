"use client";
import React, { useState, useEffect } from 'react';

export default function FactureInfoPage() {
  const [info, setInfo] = useState({ nomService: '', adresse: '', contact: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem('pichflow_sender_info');
    if (data) setInfo(JSON.parse(data));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pichflow_sender_info', JSON.stringify(info));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fi-wrapper">
      <div className="fi-header">
        <h1>Facturation</h1>
        <p>Infos de l'émetteur pour vos documents PDF.</p>
      </div>

      <div className="fi-main-layout">
        {/* FORMULAIRE */}
        <div className="fi-form-section">
          <section className="fi-card">
            <div className="fi-card-title">
              <i className="fa-solid fa-pen"></i> Informations
            </div>
            <form onSubmit={handleSave} className="fi-form">
              <div className="fi-field">
                <label>Nom du Service</label>
                <input type="text" value={info.nomService} onChange={(e)=>setInfo({...info, nomService: e.target.value})} required />
              </div>
              <div className="fi-field">
                <label>Adresse</label>
                <input type="text" value={info.adresse} onChange={(e)=>setInfo({...info, adresse: e.target.value})} required />
              </div>
              <div className="fi-field">
                <label>Contact (Email/Tél)</label>
                <input type="text" value={info.contact} onChange={(e)=>setInfo({...info, contact: e.target.value})} required />
              </div>
              <button type="submit" className={`fi-btn-save ${saved ? 'success' : ''}`}>
                {saved ? "Enregistré !" : "Sauvegarder"}
              </button>
            </form>
          </section>
        </div>

        {/* APERÇU */}
        <div className="fi-preview-section">
          <section className="fi-card">
            <div className="fi-card-title">
              <i className="fa-solid fa-eye"></i> Aperçu émetteur
            </div>
            <div className="fi-preview-box">
              <h2>{info.nomService || "NOM DU SERVICE"}</h2>
              <p><strong>📍</strong> {info.adresse || "Adresse..."}</p>
              <p><strong>📞</strong> {info.contact || "Contact..."}</p>
            </div> 
          </section>
        </div> 
      </div>
      <br /><br /><br />
    </div>
  );
}