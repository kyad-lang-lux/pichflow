"use client";

import React, { useState, useEffect } from "react";
import {
  getFullAIHistoryAction,
  checkLinkedInLinkedAction,
  getLinkedInLoginUrlAction,
  publishToLinkedInAction,
} from "./aiAction";

export default function LinkedInPage() {
  const [activeTab, setActiveTab] = useState("Marketing");
  const [items, setItems] = useState<any[]>([]);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    getFullAIHistoryAction().then(setItems);
    checkLinkedInLinkedAction().then(setIsLinked);
  }, []);

  const filteredItems = items.filter(item => 
    activeTab === "Historique AI" ? true : item.category.toLowerCase() === activeTab.toLowerCase()
  );

  return (
    <div className="pf-dash-container">
      {/* HEADER STATS */}
      <div className="pf-stat-card">
        <div className="pf-stat-group">
          <div className="pf-stat-box">
            <span className="pf-label">TOTAL PUBLICATIONS</span>
            <span className="pf-value">{items.length}</span>
          </div>
          <div className="pf-stat-box">
            <span className="pf-label">RÉSEAU</span>
            <div className="pf-icon-li"><i className="fa-brands fa-linkedin"></i></div>
          </div>
        </div>
        <button className={`pf-link-status ${isLinked ? 'active' : ''}`}>
          {isLinked ? "LinkedIn Connecté" : "Connecter LinkedIn"}
        </button>
      </div>

      <h1 className="pf-section-title">Gestionnaire de Contenu</h1>

      {/* NAVIGATION TABS */}
      <div className="pf-tabs-row">
        {["Historique AI", "Marketing", "Copywriting", "✍️ Écriture"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pf-tab-btn ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* GRID DE CARTES */}
      <div className="pf-content-grid">
        {filteredItems.map((item) => (
          <div key={item.id} className="pf-item-card">
            <div className="pf-card-head">
              <span className="pf-badge">{item.type}</span>
              <div className="pf-mini-li"><i className="fa-brands fa-linkedin"></i></div>
            </div>
            <h3 className="pf-item-title">{item.subject}</h3>
            <p className="pf-item-desc">{item.content}</p>
            <div className="pf-card-foot">
              <button className="pf-btn-pub">Publier</button>
              <button className="pf-btn-det">Détails</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}