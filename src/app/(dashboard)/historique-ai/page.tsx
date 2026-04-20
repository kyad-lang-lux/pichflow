'use client';

import React, { useState, useEffect } from 'react';
import { 
  getFullAIHistoryAction, 
  getFacebookLoginUrlAction, 
  checkFacebookLinkedAction, 
  publishToFacebookAction 
} from './aiAction';

interface AIHistoryItem { 
  id: string;
  type: string;
  subject: string;
  content: string;
  category: 'marketing' | 'copywriting';
  date: number;
}

export default function HistoriqueAIPage() {
  const [items, setItems] = useState<AIHistoryItem[]>([]);
  const [filter, setFilter] = useState<'tous' | 'marketing' | 'copywriting'>('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<AIHistoryItem | null>(null);
  
  // États Facebook
  const [isFbLinked, setIsFbLinked] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  useEffect(() => {
    getFullAIHistoryAction().then(data => {
      setItems(data as AIHistoryItem[]);
      setLoading(false);
    });
    checkFacebookLinkedAction().then(linked => setIsFbLinked(linked));
  }, []);

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'tous' || item.category === filter;
    const matchesSearch = item.subject.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Impossible de copier le texte");
    }
  };

  // Action de connexion (Haut de page)
  const handleLinkFacebook = async () => {
    const url = await getFacebookLoginUrlAction();
    window.location.href = url;
  };

  // Action de publication (Sur chaque div/card)
  const handlePublishFB = async (e: React.MouseEvent, item: AIHistoryItem) => {
    e.stopPropagation(); // Empêche d'ouvrir la modale en cliquant sur le bouton

    if (!isFbLinked) {
      handleLinkFacebook();
      return;
    }

    if (!confirm(`Publier "${item.subject}" sur Facebook ?`)) return;

    setPublishingId(item.id);
    const res = await publishToFacebookAction(item.content);
    setPublishingId(null);

    if (res.success) {
      alert("✅ Publié avec succès !");
    } else {
      alert("❌ Erreur : " + res.error);
    }
  };

  return (
    <div className="history-container">
      
      {/* 1. Zone d'association du compte (Tout en haut) */}
      <div className="facebook-status-bar" style={{ marginBottom: '20px', textAlign: 'right' }}>
        {!isFbLinked ? (
          <button 
            onClick={handleLinkFacebook}
            style={{ 
              backgroundColor: '#1877F2', color: 'white', border: 'none', 
              padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' 
            }}
          >
            <i className="fa-brands fa-facebook"></i> Relier mon compte Facebook
          </button>
        ) : (
          <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '0.9rem' }}>
            <i className="fa-solid fa-circle-check"></i> Facebook Connecté
          </span>
        )}
      </div>

      <div className="history-header">
        <h1>Historique des Générations</h1>
        
        <div className="filter-tabs">
          <button className={filter === 'tous' ? 'active' : ''} onClick={() => setFilter('tous')}>Tous</button>
          <button className={filter === 'marketing' ? 'active' : ''} onClick={() => setFilter('marketing')}>Marketing</button>
          <button className={filter === 'copywriting' ? 'active' : ''} onClick={() => setFilter('copywriting')}>Copywriting</button>
        </div>

        <div className="search-bar-ai">
          <input 
            type="text" 
            placeholder="Rechercher un sujet ou un type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="history-grid">
        {loading ? (
          <p className="msg">Chargement de l'historique...</p>
        ) : filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className={`history-card ${item.category}`}
              onClick={() => setSelectedItem(item)}
              style={{ position: 'relative' }} // Pour placer le bouton Facebook
            >
              <div className="card-inner">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div className="card-tag">{item.type}</div>
                   
                   {/* 2. Bouton de publication directe sur la Div (Card) */}
                   <button 
                      onClick={(e) => handlePublishFB(e, item)}
                      disabled={publishingId === item.id}
                      title="Publier sur Facebook"
                      style={{
                        backgroundColor: isFbLinked ? '#1877F2' : '#64748b',
                        color: 'white', border: 'none', borderRadius: '50%',
                        width: '32px', height: '32px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                   >
                     {publishingId === item.id ? (
                       <i className="fa-solid fa-spinner fa-spin"></i>
                     ) : (
                       <i className="fa-brands fa-facebook-f"></i>
                     )}
                   </button>
                </div>

                <h3 className="card-subject">{item.subject}</h3>
                <p className="card-excerpt">{item.content}</p>
              </div>
              <div className="card-footer">
                <span className="card-category">{item.category}</span>
                <span className="card-date">{new Date(item.date).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          ))
        ) : (
          <p className="msg">Aucun résultat trouvé.</p>
        )}
      </div>

      {/* --- MODALE --- */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content-ai" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="card-tag">{selectedItem.type}</span>
              </div>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="modal-body scrollable-content">
              <pre className="full-content">{selectedItem.content}</pre>
            </div>

            <div className="modal-footer" style={{ gap: '10px' }}>
              <button 
                className="btn-copy" 
                onClick={() => handleCopy(selectedItem.content)}
                style={{ backgroundColor: copied ? '#16a34a' : '#e11d48', flex: 1 }}
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i> 
                {copied ? ' Copié !' : ' Copier'}
              </button>

              <button 
                className="btn-facebook" 
                onClick={(e) => handlePublishFB(e, selectedItem)}
                disabled={publishingId === selectedItem.id}
                style={{ 
                  backgroundColor: '#1877F2', color: 'white', flex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '8px', border: 'none', borderRadius: '6px', fontWeight: 'bold'
                }}
              >
                <i className={`fa-brands fa-facebook ${publishingId === selectedItem.id ? 'fa-spin' : ''}`}></i>
                {publishingId === selectedItem.id ? 'Envoi...' : 'Publier'}
              </button>

              <button className="btn-close-text" onClick={() => setSelectedItem(null)}>Fermer</button>
            </div>
          </div>
        </div>  
      )}
    </div> 
  );
}