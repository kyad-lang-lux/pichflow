"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  // État pour rendre le profil éditable
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Emérus",
    email: "emrussoglo@gmail.com"
  });

  // Calcul du pourcentage de crédits pour la barre de progression
  const creditsUsed = 450;
  const creditsTotal = 1000;
  const progressWidth = (creditsUsed / creditsTotal) * 100;

  const handleSave = () => {
    setIsEditing(false);
    // Ici on ajouterait la logique d'enregistrement API
    alert("Profil mis à jour !");
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <h1>Paramètres</h1>
        <p>Gérez vos informations personnelles et votre sécurité.</p>
      </header>
 
      <div className="settings-grid">
        {/* SECTION 1 : PROFIL & CRÉDITS */}
        <section className="settings-card reveal">
          <div className="card-header-flex">
            <div className="card-header">
              <i className="fa-solid fa-user-gear"></i>
              <h3>Mon Profil</h3>
            </div>
            
          </div>
          
          <div className="credits-display">
            <div className="credits-info">
              <span className="label">Solde de crédits </span>
              <span className="count">{creditsUsed.toLocaleString()} / {creditsTotal.toLocaleString()}</span>
            </div>
            {/* Barre de progression ajoutée */}
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progressWidth}%` }}></div>
            </div>
           <Link href="/buy-credits" className="btn-buy">Acheter des crédits</Link>
          </div>

          <div className="input-group-row">
            <div className="input-field"> 
              <label>Nom complet</label>
              <input 
                type="text" 
                value={profile.name} 
                readOnly={!isEditing}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className={isEditing ? "editable" : ""}
              />
            </div>
            <div className="input-field">
              <label>Adresse Email</label>
              <input 
                type="email" 
                value={profile.email} 
                readOnly={!isEditing}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className={isEditing ? "editable" : ""}
              />
            </div>
          </div>
        </section>

        {/* SECTION 2 : SÉCURITÉ & SESSION */}
        <section className="settings-card reveal delay-1">
          <div className="card-header">
            <i className="fa-solid fa-lock"></i>
            <h3>Sécurité & Session</h3>
          </div>

          <div className="security-actions">
            <div className="action-item">
              <div>
                <h4>Mot de passe</h4>
                <p>Sécurisez votre compte avec un mot de passe robuste.</p>
              </div>
              <Link href="/change-password" className='change-password'>Changer le mot de passe</Link>
            </div>

            <hr className="divider" />

            <div className="action-item logout-item">
              <div>
                <h4>Déconnexion</h4>
                <p>Souhaitez-vous quitter votre session actuelle ?</p>
              </div>
              <button className="btn-logout" onClick={() => window.location.href = '/'}>
                <i className="fa-solid fa-right-from-bracket"></i> Se déconnecter
              </button>
            </div>
          </div>
        </section>
        <br />
        <br /> <br />
      </div>
    </div>
  );
}