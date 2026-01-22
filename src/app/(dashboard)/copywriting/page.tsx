"use client";
import React, { useState } from 'react';

export default function CopywritingPage() {
  // 1. États pour les entrées
  const [activeMethod, setActiveMethod] = useState('AIDA');
  const [type, setType] = useState('Page de vente');
  const [product, setProduct] = useState('');
  const [target, setTarget] = useState('');
  const [objective, setObjective] = useState('Professionnel');

  // 2. États pour la génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const methods = [
    { id: 'AIDA', title: 'AIDA', desc: 'Attention, Interest, Desire, Action' },
    { id: 'PAS', title: 'PAS', desc: 'Problem, Agitation, Solution' },
    { id: 'BAB', title: 'BAB', desc: 'Avant, Après, Pont' },
  ];

  // Nettoyage des caractères spéciaux Markdown
  const cleanFormat = (text: string): string => {
    return text.replace(/[*#_~`>]/g, '').trim();
  };

  // Gestion de la copie avec Fallback (pour éviter l'erreur writeText)
  const handleCopy = async () => {
    if (!generatedResult) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedResult);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = generatedResult;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie:", err);
    }
  };

  // Téléchargement en .txt
  const handleDownload = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `copy-${activeMethod.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Fonction de génération
  const handleGenerate = async () => {
    if (!product) return alert("Veuillez décrire votre produit !");
    
    setIsGenerating(true);
    setGeneratedResult('');

    try {
      // Simulation appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fakeCopy = `MÉTHODE ${activeMethod}\n\n[ATTENTION] Découvrez comment ${product} peut changer votre quotidien.\n\n[INTÉRÊT] Conçu spécifiquement pour les ${target || 'professionnels'}...\n\n[ACTION] Commandez dès maintenant.`;
      
      setGeneratedResult(cleanFormat(fakeCopy));
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ia-page-container" style={{ width: '100%', overflowX: 'hidden', paddingBottom: '40px' }}>
      
      {/* Configuration Gauche */}
      <div className="ia-config-side" style={{ padding: '20px', maxWidth: '100%' }}>
        
        <div className="config-section">
          <h4>Type de copywriting</h4>
          <select className="ia-select" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Page de vente</option>
            <option>Landing page</option>
            <option>Publicité Facebook</option>
            <option>Fiche produit</option>
          </select>
        </div>

        <div className="config-section">
          <h4>Méthode de copywriting</h4>
          <div className="method-grid" style={{ gap: '10px' }}>
            {methods.map((method) => (
              <div 
                key={method.id}
                className={`method-card ${activeMethod === method.id ? 'active' : ''}`}
                onClick={() => setActiveMethod(method.id)}
                style={{ padding: '12px', minWidth: '0', cursor: 'pointer' }}
              >
                <span className="method-title" style={{ fontSize: '0.9rem' }}>{method.title}</span>
                <span className="method-desc" style={{ fontSize: '0.65rem' }}>{method.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h4><i className="fa-solid fa-bolt-lightning" style={{color: '#FF7A30', marginRight: '8px'}}></i> Produit / Service</h4>
          <textarea 
            className="ia-textarea" 
            placeholder="Décrivez votre produit..."
            style={{ width: '100%' }}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          ></textarea>
        </div>

        <div className="config-section">
          <h4><i className="fa-solid fa-user-group" style={{color: '#2563EB', marginRight: '8px'}}></i> Cible</h4>
          <input 
            type="text" 
            className="ia-input" 
            placeholder="Ex: Entrepreneurs..." 
            style={{ width: '100%' }}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>

        <div className="config-section">
          <h4><i className="fa-solid fa-bullseye" style={{color: '#10B981', marginRight: '8px'}}></i> Objectif</h4>
          <select className="ia-select" value={objective} onChange={(e) => setObjective(e.target.value)}>
            <option>Professionnel</option>
            <option>Persuasif</option>
            <option>Urgent</option>
          </select>
        </div>

        <button className="btn-generate" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <><i className="fa-solid fa-spinner fa-spin"></i> Génération...</>
          ) : (
            <><i className="fa-solid fa-pen-nib"></i> Générer le copy</>
          )}
        </button>
      </div>

      {/* Aperçu Droite */}
      <div className="ia-result-side" style={{ width: '100%', minWidth: '0' }}>
        <div className="result-card" style={{ padding: '20px', minHeight: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h4>Texte généré</h4>
            {generatedResult && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleCopy} style={{ background: 'none', border: 'none', color: isCopied ? '#10B981' : 'var(--primary-blue)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <i className={isCopied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i> {isCopied ? 'Copié' : 'Copier'}
                </button>
                <button onClick={handleDownload} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <i className="fa-solid fa-download"></i> .TXT
                </button>
              </div>
            )}
          </div>

          {generatedResult ? (
            <div className="result-content" style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              {generatedResult}
            </div>
          ) : (
            <div className="empty-result" style={{ padding: '30px', textAlign: 'center' }}>
              {isGenerating ? (
                <div className="loading-animation">
                   <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-blue)' }}></i>
                   <p>Rédaction du copy en cours...</p>
                </div>
              ) : (
                <>
                  <div className="empty-icon"><i className="fa-solid fa-pen-fancy"></i></div>
                  <p style={{ fontSize: '0.9rem' }}>Votre texte de vente apparaîtra ici</p>
                  <span className="empty-subtext" style={{ fontSize: '0.75rem' }}>Utilisez les méthodes AIDA, PAS ou BAB</span>
                </>
              )}
            </div>
          )}
        </div>

        <br />
        <br /> <br />
      </div>
    </div>
  );
}