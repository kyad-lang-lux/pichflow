'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Composant interne pour utiliser le hook useGoogleLogin
function GoogleLoginButton({ onLoading }: { onLoading: (loading: boolean) => void }) {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Token récupéré:', tokenResponse);
      // Ici, en production, on enverrait le token au backend pour vérification
      router.push('/dashboard');
    },
    onError: () => {
      console.log('Erreur de connexion Google');
      onLoading(false);
    },
  });

  return (
    <button 
      type="button" 
      className="btn-google" 
      onClick={() => {
        onLoading(true);
        login();
      }}
    >
      <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="Google" />
      <span>Continuer avec Google</span>
    </button>
  );
}

export default function Connexion() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <GoogleOAuthProvider clientId="917194298260-1sp5ltg1h2lprjmne64elqgqltsdogor.apps.googleusercontent.com">
      <div className="auth-container">
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
            <h1>Bon retour !</h1>
            <p className="subtitle">Connectez-vous pour accéder à votre dashboard</p>

            {/* BOUTON GOOGLE AVEC TON STYLE ET LA VRAIE LOGIQUE */}
            {isGoogleLoading ? (
              <button className="btn-google" disabled>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Connexion...</span>
              </button>
            ) : (
              <GoogleLoginButton onLoading={setIsGoogleLoading} />
            )}

            <div className="auth-separator">
              <span>OU</span>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
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
                <div className="label-row">
                  <label>Mot de passe</label>
                  <Link href="#" className="forgot-pass">Mot de passe oublié ?</Link>
                </div>
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
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i> 
                    Vérification...
                  </>
                ) : (
                  <>Se connecter <i className="fa-solid fa-arrow-right"></i></>
                )}
              </button>
            </form>

            <p className="auth-switch">
              Pas encore de compte ? <Link href="/inscription">S'inscrire</Link>
            </p>
          </div>
        </div>

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
    </GoogleOAuthProvider>
  );
}