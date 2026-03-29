"use client";
import Link from "next/link";

export default function DashboardPage() {
  const tools = [
    {  
      title: "Devis Rapide",
      desc: "Créez des devis de manière facile et rapide avec téléchargement illimité sur pichflow.",
      icon: "fas fa-receipt",
      className: "icon-facture",
      link: "/factures" 
    },
    {  
      title: "Facturation Rapide",
      desc: " Créez des factures rapidement avec téléchargement illimité sur pichflow.",
      icon: "fa-file-invoice-dollar",
      className: "icon-facture",
      link: "/factures" 
    },
    {
      title: "Contenu Marketing IA",
      desc: "Générez des articles de blog SEO, posts réseaux sociaux et emails marketing en quelques clics.",
      icon: "fa-handshake",
      className: "icon-marketing",
      link: "/contenu-ia"
    },
    {  
      title: "Copywriting IA",
      desc: "Créez des pages de vente, landing pages et textes publicitaires avec les méthodes AIDA, PAS et plus.",
      icon: "fa-lightbulb",
      className: "icon-copy",
      link: "/copywriting"
    },
    
    {
      title: "Rapports ",
      desc: "Catégorisation automatique des revenus et dépenses avec alertes financières intelligentes.",
      icon: "fa-chart-bar",
      className: "icon-compta",
      link: "/rapports"
    }
  ];

  return (
    <div className="dashboard-home">
        <h3 className="welcome"> Bienvenu(e) dans votre dashboard <span>... </span> </h3> 
      
      <div className="tools-grid"> 
        {tools.map((tool, index) => (
          <div key={index} className="tool-card">
            <div className={`tool-icon-wrapper ${tool.className}`}>
              <i className={`fa-solid ${tool.icon}`}></i>
            </div>
            <h3>{tool.title}</h3> 
            <p>{tool.desc}</p>
            <Link href={tool.link} className="btn-access">
              Accéder <i className="fa-solid fa-arrow-right"></i>
            </Link> 
          </div>
        ))}
      </div>

      <br /> <br /> <br /> 
    </div>
  );
}