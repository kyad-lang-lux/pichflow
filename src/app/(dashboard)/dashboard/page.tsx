"use client";
import Link from "next/link";

export default function DashboardPage() {
  const tools = [
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
      title: "Facturation Automatisée",
      desc: "Créez devis et factures rapidement avec suivi des paiements et rappels automatiques.",
      icon: "fa-file-invoice-dollar",
      className: "icon-facture",
      link: "/factures" 
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
        <h3 className="welcome"> Bienvenu(e) dans votre tableau de bord <span>... </span> </h3> <br />
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