"use client";

import React, { useState, useEffect } from "react";
import { generateAIContent } from "./generateAIClient"; 

interface HistoriqueItem {
  id: string;
  type: string;
  sujet: string;
  contenu: string;
  date: string;
}
 
export default function ContenuIAPage() {
  // 1️⃣ États pour le formulaire
  const [selectedType, setSelectedType] = useState("Article de blog SEO");
  const [tone, setTone] = useState("Professionnel");
  const [prompt, setPrompt] = useState("");

  // 2️⃣ États pour la génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // 3️⃣ États pour l'Historique
  const [historique, setHistorique] = useState<HistoriqueItem[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<HistoriqueItem | null>(null);

  // Charger l'historique au démarrage
  useEffect(() => {
    const saved = localStorage.getItem("pichflow_marketing_history");
    if (saved) setHistorique(JSON.parse(saved));
  }, []);

  const contentTypes = [
    { id: "blog", label: "Article de blog SEO", icon: "fa-file-lines" },
    { id: "social", label: "Réseau sociaux", icon: "fa-share-nodes" },
    { id: "email", label: "Email marketing", icon: "fa-envelope" },
    { id: "video", label: "Script vidéo", icon: "fa-video" },
  ];

  const SolidBlackLoader = ({ size = "20px" }) => (
    <div
      style={{
        width: size, height: size,
        border: "3px solid #000",
        borderBottomColor: "transparent",
        borderRadius: "50%",
        display: "inline-block",
        animation: "rotation 1s linear infinite",
      }}
    >
      <style>{`@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const cleanFormat = (text: string): string => {
    return text
      .replace(/^#+\s*/gm, "")
      .replace(/[*_~`]/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const handleCopy = async (text?: string) => {
    const contentToCopy = text || generatedResult;
    if (!contentToCopy) return;
    await navigator.clipboard.writeText(contentToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = (text?: string, type?: string) => {
    const content = text || generatedResult;
    if (!content) return;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pichflow-${(type || selectedType).toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const deleteHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historique.filter(h => h.id !== id);
    setHistorique(updated);
    localStorage.setItem("pichflow_marketing_history", JSON.stringify(updated));
  };

 const referenceStyleText = `
Style Article de blog SEO :

[
Titre : Comment transformer vos compétences en revenus digitaux en 30 jours

Vous avez une compétence mais vous ne savez pas comment la convertir en revenu ? Aujourd’hui, n’importe qui peut monétiser son expertise grâce au digital — encore faut-il utiliser la bonne méthode.

Dans cet article, découvrez comment créer un produit digital professionnel, lancer votre site sans compétence technique et attirer vos premiers clients grâce à une stratégie simple.

Avec notre programme, vous apprendrez à :
- Créer un produit digital structuré et prêt à vendre ;
- Mettre en place une stratégie de contenu qui génère des ventes.

Ne laissez plus votre talent dormir : en 30 jours, vous pouvez passer de simple compétence à revenu concret.

Rejoignez le programme dès aujourd’hui et commencez votre transformation digitale.
]

Style Réseau sociaux :
[
🚀 Vous avez du talent… mais pas encore de revenus ?

Bonne nouvelle : en seulement 7 jours, vous pouvez transformer vos compétences en un produit digital rentable.

✔ Créez votre site depuis votre téléphone  
✔ Lancez vos offres sans stock ni capital  
✔ Attirez vos clients grâce à des contenus simples et efficaces

Si vous êtes prêt à passer de l’idée à l’action, c’est maintenant.

🔥 Rejoignez la formation et commencez votre business digital !
]

Style Email marketing :

[
Objet : Transformez vos compétences en revenu dès ce mois-ci

Bonjour [Prénom],

Vous avez une compétence, mais vous ne savez pas comment la monétiser ?  
Notre Masterclass Digital Addict Sellers vous montre pas à pas comment créer votre premier produit digital et le vendre efficacement.

Voici ce que vous allez apprendre :
- Créer un site professionnel directement depuis votre téléphone ;
- Lancer vos premières ventes rapidement et sans capital.

Offre limitée : seulement 20 places disponibles.
CTA : [Je réserve ma place maintenant]
]

Style Script vidéo :

[
[Intro]
Comment percer sur YouTube ?  
ça c'est une question que presque 80 % des gens se posent en se lançant sur Youtube en se basant souvent sur des modèles de youtubeurs connus et d'ailleurs il y a plein de tutos qui expliquent comment percer sur Youtube mais aucun n'explique réellement comment bien percer.
[Storytelling]

Déjà les premières questions à se poser quand on se lance sur Youtube c'est comment je veux percer et dans quelle domaine est-ce que vous souhaitez vous lancer dans le divertissement tout ce qui est train danse tuto général, etc.
le but c'est de trouver un domaine qui vous plaît et dans lequel vous êtes motivé parce que avant d'être connu sur YouTube il y a un long chemin à parcourir et si vous n'aimez pas ce que vous faites et que vous voulez juste gagner de l'argent et des abonnés vous risquez très fortement d'abandonner un jour ou l'autre.
Après pour ce qui est de comment vous voulez percer vous avez le choix entre deux catégories les shorts ou les vidéos longues sachant que le choix que vous allez faire pour avoir un impact sur votre future communauté. 

[Explications ou démonstrations]
Vous devez avoir un planning de vidéos assez régulier parce que l'algorithme youtube il mettra plus vos vidéos en avant si vous en postez genre une par semaine par exemple alors que si jamais vous en postez par exemple 5 par jour oui ça fait ça fait beaucoup j'ai peut-être un petit peu abusé mais bon du coup si vous en postez cinq par jour elles 
seront beaucoup moins mises en avant et sinon je fais une petite aparté sur comment marche l'algorithme de YouTube en fait si par exemple vidéo elle a 1000 vues et que sur les 1000 vues vous avez 
genre 700 likes 400 commentaires et genre allez je sais pas 200 partages alors elle va vraiment être mise en avant.

[Conclusion]
Essayez de trouver un planning de vidéo stable qui vous convient que vous pouvez assez bien respecter le secret pour percer sur Youtube c'est de faire ce que l'on aime et si on est fier de ce que l'on produit et qu'on en a pas honte on percera un jour ou l'autre si vous avez des commentaires négatifs sur vos vidéos supprimez-les et ne lâchez jamais gardz un mental d'acier les personnes les plus fortes ne sont pas toujours les personnes qui 
gagnent mais celles qui n'abandonnent pas quand elles perdent ne lâchez jamais.


]
`;

  const handleGenerate = async () => {
    if (!prompt) return alert("Veuillez décrire un sujet !");
    setIsGenerating(true);
    setGeneratedResult("");

    const systemInstruction = `
Tu es un expert en marketing digital. Rédige un(e) ${selectedType} avec un ton ${tone}.
IMPORTANT : Ne fournis que le texte brut. Pas de Markdown. Respecte les accents.
UTILISE LES STYLES SUIVANTS COMME RÉFÉRENCE : ${referenceStyleText}`;

    try {
      const text = await generateAIContent(`Sujet : ${prompt}`, systemInstruction);
      const cleaned = cleanFormat(text);
      setGeneratedResult(cleaned);

      // Sauvegarde dans l'historique
      const newItem: HistoriqueItem = {
        id: Date.now().toString(),
        type: selectedType,
        sujet: prompt,
        contenu: cleaned,
        date: new Date().toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })
      };
      const updatedHistory = [newItem, ...historique];
      setHistorique(updatedHistory);
      localStorage.setItem("pichflow_marketing_history", JSON.stringify(updatedHistory));

    } catch (error: any) {
      alert("Erreur serveur IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ia-page-container">
      
      {/* POPUP DE DÉTAIL HISTORIQUE */}
      {selectedHistory && (
        <div className="modal-overlay" onClick={() => setSelectedHistory(null)}>
          <div className="modal-content custom-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3>{selectedHistory.type}</h3>
              <button onClick={() => setSelectedHistory(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <p style={{ fontSize: '12px', color: '#666' }}>Sujet : {selectedHistory.sujet}</p>
            <hr />
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.95rem' }}>
              {selectedHistory.contenu}
            </div>
            <div className="modal-actions" style={{ marginTop: '20px' }}>
              <button className="btn-cancel" onClick={() => handleDownload(selectedHistory.contenu, selectedHistory.type)}>Télécharger</button>
              <button className="btn-submit" onClick={() => { handleCopy(selectedHistory.contenu); setSelectedHistory(null); }}>Copier & Fermer</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}>
        {/* ----- COLONNE GAUCHE ----- */}
        <div className="ia-config-side" style={{ flex: "1", minWidth: "300px" }}>
          <div className="config-section">
            <h4>Type de contenu</h4>
            <div className="type-grid">
              {contentTypes.map((type) => (
                <button key={type.id} className={`type-card ${selectedType === type.label ? "active" : ""}`} onClick={() => setSelectedType(type.label)}>
                  <i className={`fa-solid ${type.icon}`}></i> {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="config-section">
            <h4>Ton du contenu</h4>
            <select className="ia-select" value={tone} onChange={(e) => setTone(e.target.value)}>
              <option>Professionnel</option>
              <option>Amical</option>
              <option>Persuasif</option>
              <option>Enthousiaste</option>
            </select>
          </div>

          <div className="config-section">
            <h4>Sujet ou thème</h4>
            <textarea className="ia-textarea" placeholder="Décrivez le sujet..." value={prompt} onChange={(e) => setPrompt(e.target.value)}></textarea>
          </div>

          <button className="btn-generate" onClick={handleGenerate} disabled={isGenerating} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%" }}>
            {isGenerating ? <><SolidBlackLoader size="16px" /> Génération...</> : <><i className="fa-solid fa-wand-magic-sparkles"></i> Générer</>}
          </button>
        </div>

        {/* ----- COLONNE DROITE ----- */}
        <div className="ia-result-side" style={{ flex: "1.5", minWidth: "300px" }}>
          <div className="result-card" style={{ height: "100%", minHeight: "450px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
              <h4>Résultat</h4>
              {generatedResult && (
                <div style={{ display: "flex", gap: "15px" }}>
                  <button onClick={() => handleCopy()} style={{ background: "none", border: "none", color: isCopied ? "#10b981" : "#000", fontWeight: "bold", cursor: "pointer" }}>
                    <i className={isCopied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i> {isCopied ? "Copié" : "Copier"}
                  </button>
                </div>
              )}
            </div>
            {generatedResult ? (
              <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{generatedResult}</div>
            ) : (
              <div style={{ textAlign: "center", marginTop: "100px", color: "#999" }}>
                {isGenerating ? <SolidBlackLoader size="40px" /> : <p>L'IA attend vos instructions...</p>}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----- SECTION HISTORIQUE (EN BAS) ----- */}
      <div style={{ marginTop: "50px" }}>
        <h4 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fa-solid fa-clock-rotate-left"></i> Historique des générations
        </h4>
        
        {historique.length === 0 ? (
          <p style={{ color: "#999", fontStyle: "italic" }}>Aucun historique pour le moment.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {historique.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedHistory(item)}
                style={{ 
                  background: "#fff", padding: "15px", borderRadius: "12px", border: "1px solid #eee", 
                  cursor: "pointer", position: "relative", transition: "0.2s hover"
                }}
                // onMouseEnter={(e) => e.currentTarget.style.borderColor = "#000"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#eee"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ fontSize: "10px", fontWeight: "bold", background: "#f0f0f0", padding: "2px 8px", borderRadius: "4px" }}>{item.type}</span>
                  <button onClick={(e) => deleteHistory(item.id, e)} style={{ background: "none", border: "none", color: "#ff4d4d", cursor: "pointer" }}>
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
                <p style={{ fontSize: "13px", fontWeight: "600", margin: "5px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.sujet}</p>
                <p style={{ fontSize: "11px", color: "#999" }}>{item.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <br /><br /> <br /> 
    </div>
  );
}