'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Inscription() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation de création de compte (2 secondes)
    setTimeout(() => {
      setIsLoading(false);
      // Redirection vers le dashboard après inscription
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="auth-container">
      {/* Côté Gauche : Formulaire */}
      <div className="auth-form-side">
        <div className="auth-header">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <i className="fa-solid fa-bolt-lightning"></i>
            </div>
            <span className="logo-text">Pitch<span>Flow</span></span>
          </Link>
        </div>

        <div className="auth-content">
          <h1>Créez votre compte</h1>
          <p className="subtitle">Commencez votre essai gratuit de 7 jours</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Nom complet</label>
              <div className="input-wrapper">
                <i className="fa-regular fa-user"></i>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <i className="fa-regular fa-envelope"></i>
                <input 
                  type="email" 
                  placeholder="john@example.com" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="input-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <i className="fa-solid fa-lock"></i>
                <input 
                  type="password" 
                  placeholder="........" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-auth-submit" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i> 
                  Création du compte...
                </>
              ) : (
                <>Créer mon compte <i className="fa-solid fa-arrow-right"></i></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Déjà un compte ? <Link href="/connexion">Se connecter</Link>
          </p>
        </div>
      </div>

      {/* Côté Droit : Panel Bleu */}
      <div className="auth-info-side">
        <div className="info-content">
          <div className="info-icon-box">
            <i className="fa-solid fa-bolt-lightning"></i>
          </div>
          <h2>Marketing IA + Facturation</h2>
          <p>Générez du contenu percutant et gérez vos finances en toute simplicité.</p>
          
          <ul className="info-list">
            <li><i className="fa-solid fa-circle-check"></i> Articles SEO et posts réseaux sociaux</li>
            <li><i className="fa-solid fa-circle-check"></i> Copywriting avec méthodes AIDA, PAS</li>
            <li><i className="fa-solid fa-circle-check"></i> Facturation et comptabilité automatisées</li>
          </ul>
        </div>
      </div>
    </div>
  );
}