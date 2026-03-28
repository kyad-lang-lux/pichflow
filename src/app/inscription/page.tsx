'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Composant interne pour garder ton style de bouton personnalisé
function GoogleSignupButton({ onDataFetched, onLoading }: { 
  onDataFetched: (data: any) => void, 
  onLoading: (loading: boolean) => void 
}) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      onLoading(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const data = await res.json();
        onDataFetched(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des infos Google", error);
      } finally {
        onLoading(false);
      }
    },
    onError: () => {
      console.log('Erreur Inscription Google');
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
      <span>S'inscrire avec Google</span>
    </button>
  );
}

export default function Inscription() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // --- LOGIQUE DE VALIDATION DU MOT DE PASSE ---
  const passwordRequirements = useMemo(() => {
    const pw = formData.password;
    return [
      { label: "8 caractères minimum", met: pw.length >= 8 },
      { label: "Une majuscule (A-Z)", met: /[A-Z]/.test(pw) },
      { label: "Une minuscule (a-z)", met: /[a-z]/.test(pw) },
      { label: "Un chiffre (0-9)", met: /[0-9]/.test(pw) },
      { label: "Un symbole (!@#$%...)", met: /[^A-Za-z0-9]/.test(pw) },
    ];
  }, [formData.password]);

  const isPasswordValid = passwordRequirements.every(req => req.met);

  // Remplissage auto après succès Google
  const handleGoogleData = (data: any) => {
    setFormData({
      ...formData,
      name: `${data.given_name} ${data.family_name}`,
      email: data.email,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;

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
          <br />
 <br /> <br />
          <div className="auth-content">
            <h1>Créez votre compte</h1>
            <p className="subtitle">Commencez votre essai gratuit de 7 jours</p>

            {isGoogleLoading ? (
              <button className="btn-google" disabled>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Récupération...</span>
              </button>
            ) : (
              <GoogleSignupButton 
                onDataFetched={handleGoogleData} 
                onLoading={setIsGoogleLoading} 
              />
            )}

            <div className="auth-separator">
              <span>OU COMPLÉTEZ VOS INFOS</span>
            </div>

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
                    placeholder="Créez un mot de passe fort" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                {/* --- LISTE DE VALIDATION EN TEMPS RÉEL --- */}
                {formData.password.length > 0 && (
                  <div className="password-checklist" style={{ marginTop: '12px' }}>
                    {passwordRequirements.map((req, i) => (
                      <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        fontSize: '0.75rem', 
                        color: req.met ? '#10B981' : '#9CA3AF',
                        marginBottom: '4px'
                      }}>
                        <i className={req.met ? "fa-solid fa-circle-check" : "fa-solid fa-circle-dot"}></i>
                        <span>{req.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className="btn-auth-submit" 
                disabled={isLoading || isGoogleLoading || !isPasswordValid}
                style={{ 
                    marginTop: '15px',
                    opacity: isPasswordValid ? 1 : 0.6,
                    cursor: isPasswordValid ? 'pointer' : 'not-allowed'
                }}
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