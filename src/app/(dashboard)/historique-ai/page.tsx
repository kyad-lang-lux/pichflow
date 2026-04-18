'use client';

import React, { useState, useEffect } from 'react';
import { getFullAIHistoryAction } from './aiAction';
// import './historique.css';

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

  useEffect(() => {
    getFullAIHistoryAction().then(data => {
      setItems(data as AIHistoryItem[]);
      setLoading(false);
    });
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
    
    // Réinitialise le bouton après 2 secondes
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  } catch (err) {
    console.error("Erreur lors de la copie : ", err);
    alert("Impossible de copier le texte");
  }
};

  return (
    <div className="history-container">
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
            >
              <div className="card-inner">
                <div className="card-tag">{item.type}</div>
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

      {/* --- MODALE D'AFFICHAGE COMPLET AVEC SCROLL --- */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content-ai" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="card-tag">{selectedItem.type}</span>
                {/* <h2>{selectedItem.subject}</h2> */}
              </div>
              <button className="close-btn" onClick={() => setSelectedItem(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            
            <div className="modal-body scrollable-content">
              <pre className="full-content">{selectedItem.content}</pre>
            </div>

            <div className="modal-footer">
  <button 
    className="btn-copy" 
    onClick={() => handleCopy(selectedItem.content)}
    style={{ backgroundColor: copied ? '#16a34a' : '#e11d48' }} // Vert si copié, rouge sinon
  >
    <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i> 
    {copied ? ' Copié !' : ' Copier'}
  </button>
  <button className="btn-close-text" onClick={() => setSelectedItem(null)}>Fermer</button>
</div>
          </div> <br /> <br /> <br />
        </div>  
      )} <br /> <br /> <br />
    </div> 
  );
}