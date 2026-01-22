"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation
    setTimeout(() => {
      setLoading(false);
      alert("Mot de passe modifié avec succès !");
      router.push('/parametres');
    }, 1500);
  };

  return (
    <div className="settings-container">
      <button className="btn-back-link" onClick={() => router.back()}>
        <i className="fa-solid fa-chevron-left"></i> Retour aux paramètres
      </button>

      <div className="settings-grid single-col">
        <section className="settings-card reveal">
          <div className="card-header">
            <i className="fa-solid fa-shield-halved"></i>
            <h3>Sécurité du compte</h3>
          </div>
          
          <form onSubmit={handleUpdate} className="password-form-container">
            <div className="input-field full-width">
              <label>Mot de passe actuel</label>
              <input type="password" placeholder="••••••••" required />
            </div>
            
            <div className="input-group-row">
              <div className="input-field">
                <label>Nouveau mot de passe</label>
                <input type="password" placeholder="Minimum 8 caractères" required />
              </div>
              <div className="input-field">
                <label>Confirmer le nouveau</label>
                <input type="password" placeholder="Confirmez" required />
              </div>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn-save" disabled={loading}>
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}