"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Nouvel état pour capturer les mots de passe
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Vérification de correspondance (retourne true si vide ou si ça match)
  const isMatching = passwords.new === passwords.confirm;
  const canSubmit = passwords.new !== '' && passwords.confirm !== '' && isMatching;

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Sécurité supplémentaire avant de lancer le loading
    if (!isMatching) return;

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
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </div>
            
            <div className="input-group-row">
              <div className="input-field">
                <label>Nouveau mot de passe</label>
                <input 
                  type="password" 
                  placeholder="Minimum 8 caractères" 
                  required 
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
              </div>
              <div className="input-field">
                <label>Confirmer le nouveau</label>
                <input 
                  type="password" 
                  placeholder="Confirmez" 
                  required 
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                  style={!isMatching && passwords.confirm.length > 0 ? { borderColor: '#ef4444' } : {}}
                />
                {/* Petit message d'aide sans changer la structure */}
                {!isMatching && passwords.confirm.length > 0 && (
                  <span style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>
                    Les mots de passe ne correspondent pas
                  </span>
                )}
              </div>
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className="btn-save" 
                disabled={loading || !canSubmit}
              >
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}