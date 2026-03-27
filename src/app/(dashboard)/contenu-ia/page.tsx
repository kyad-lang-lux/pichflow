"use client";

import React, { useState } from "react";
import { generateAIContent } from "./generateAIClient"; // ⬅️ IMPORT IMPORTANT

export default function ContenuIAPage() {
  // 1️⃣ États pour le formulaire
  const [selectedType, setSelectedType] = useState("Article de blog SEO");
  const [tone, setTone] = useState("Professionnel");
  const [prompt, setPrompt] = useState("");

  // 2️⃣ États pour la génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const contentTypes = [
    { id: "blog", label: "Article de blog SEO", icon: "fa-file-lines" },
    { id: "social", label: "Réseau sociaux", icon: "fa-share-nodes" },
    { id: "email", label: "Email marketing", icon: "fa-envelope" },
    { id: "video", label: "Script vidéo", icon: "fa-video" },
  ];

  // 3️⃣ Loader noir animé
  const SolidBlackLoader = ({ size = "20px" }) => (
    <div
      style={{
        width: size,
        height: size,
        border: "3px solid #000",
        borderBottomColor: "transparent",
        borderRadius: "50%",
        display: "inline-block",
        animation: "rotation 1s linear infinite",
      }}
    >
      <style>
        {`@keyframes rotation { 
          0% { transform: rotate(0deg); } 
          100% { transform: rotate(360deg); } 
        }`}
      </style>
    </div>
  );

  // 4️⃣ Nettoyage texte brut (garde accents et apostrophes)
  const cleanFormat = (text: string): string => {
    return text
      .replace(/^#+\s*/gm, "")       // titres markdown
      .replace(/[*_~`]/g, "")        // gras/italique/barré/code
      .replace(/\n{3,}/g, "\n\n")    // trop d'espaces
      .trim();
  };

  // 5️⃣ Copier
  const handleCopy = async () => {
    if (!generatedResult) return;
    await navigator.clipboard.writeText(generatedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 6️⃣ Télécharger
  const handleDownload = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pichflow-${selectedType.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 7️⃣ TEXTE DE STYLE À IMITER (ici tu colles tous tes styles de copywriting)
const referenceStyleText = `

Style Article de blog SEO :

[ 
Titre : Comment transformer vos compétences en revenus digitaux en 30 jours

Vous avez une compétence mais ne savez pas comment la monétiser ? Que vous soyez coach, créateur de contenu ou entrepreneur en herbe, il existe une méthode claire pour générer vos premiers revenus en ligne.

Avec notre programme, vous apprendrez à :  
- Créer un produit digital professionnel, prêt à vendre.  
- Déployer votre site et vendre sans stock ni capital.  
- Attirer vos premiers clients via les réseaux sociaux et les campagnes simples.  

Ne perdez plus de temps à improviser : en 30 jours, vous pourrez transformer vos connaissances en un revenu stable.

CTA : Rejoignez notre programme aujourd’hui et commencez à générer vos premiers revenus digitaux.
]

Style Réseau sociaux :

[ 
🚀 Vous avez un talent mais pas de revenu ?  

En 7 jours seulement, apprenez à transformer vos compétences en produit digital.  

✅ Créez votre site depuis votre téléphone  
✅ Vendez sans stock et sans capital  
✅ Attirez vos clients sur Instagram et TikTok  

Les places sont limitées !  

🔥 Inscrivez-vous maintenant et passez à l’action !
]

Style Email marketing :

[ 
Objet : Transformez vos compétences en revenu dès ce mois-ci

Bonjour [Prénom],  

Vous avez déjà une compétence mais vous ne savez pas comment en tirer un revenu ?  

Rejoignez notre Masterclass Digital Addict Sellers et découvrez comment créer votre premier produit digital et le vendre efficacement.  

- Créez un site professionnel depuis votre téléphone  
- Publiez du contenu stratégique pour attirer vos clients  
- Lancez vos ventes rapidement, sans stock ni capital  

Offre spéciale : seulement 20 places disponibles. Réservez la vôtre maintenant !  

CTA : [Je réserve ma place]
]

Style Script vidéo :

[ 
[Intro]  
Salut ! Vous êtes bloqué à cause d’un manque de ressources ou d’expérience ? Rassurez-vous, vous n’êtes pas seul.  

[Storytelling]  
Il y a quelques années, j’avais un téléphone et une seule question : comment gagner ma vie en ligne ? Pas de PC, pas de formation, juste la motivation.  

[Solution]  
Aujourd’hui, j’ai créé plus de 100 sites et généré des milliers d’euros. Et vous pouvez faire pareil !  

[Bénéfices]  
Dans ce programme, vous apprendrez à :  
- Créer un site pro depuis votre téléphone  
- Attirer vos premiers clients  
- Vendre vos compétences en ligne  

[CTA]  
Cliquez sur le lien et commencez votre transformation dès aujourd’hui. Ne restez pas spectateur, devenez acteur de votre succès digital !
]
`;

  // 8️⃣ Génération IA
  const handleGenerate = async () => {
    if (!prompt) return alert("Veuillez décrire un sujet !");

    setIsGenerating(true);
    setGeneratedResult("");

    const systemInstructions = `
Tu es un expert en marketing digital.
Rédige un(e) ${selectedType} avec un ton ${tone}.
IMPORTANT : Ne fournis que le texte brut. Pas de Markdown (#, *, etc.).
Respecte parfaitement les accents et les apostrophes.
Le texte doit être clair, aéré et professionnel.
UTILISE LES STYLES SUIVANTS COMME RÉFÉRENCE POUR TON STYLE D'ÉCRITURE :
${referenceStyleText}
`;

    try {
      const text = await generateAIContent(`Sujet : ${prompt}`, systemInstructions);
      setGeneratedResult(cleanFormat(text));
    } catch (error: any) {
      console.error("ERREUR IA:", error);

      if (error.message?.includes("clé") || error.message?.includes("API")) {
        alert("Problème de clé API. Vérifiez votre configuration.");
      } else {
        alert("Erreur serveur IA.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ia-page-container">

      {/* ----- COLONNE GAUCHE ----- */}
      <div className="ia-config-side">
        <div className="config-section">
          <h4>Type de contenu</h4>
          <div className="type-grid">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                className={`type-card ${selectedType === type.label ? "active" : ""}`}
                onClick={() => setSelectedType(type.label)}
              >
                <i className={`fa-solid ${type.icon}`}></i>
                {type.label}
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
          <textarea
            className="ia-textarea"
            placeholder="Décrivez le sujet de votre contenu..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          ></textarea>
        </div>

        <button
          className="btn-generate"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          {isGenerating ? (
            <>
              <SolidBlackLoader size="16px" /> Génération...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Générer le contenu
            </>
          )}
        </button>
      </div>

      {/* ----- COLONNE DROITE ----- */}
      <div className="ia-result-side" style={{ height: "100%" }}>
        <div className="result-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h4>Contenu généré</h4>

            {generatedResult && (
              <div style={{ display: "flex", gap: "15px" }}>
                <button
                  onClick={handleCopy}
                  style={{
                    background: "none",
                    border: "none",
                    color: isCopied ? "#10b981" : "var(--primary-blue)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <i className={isCopied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
                  {isCopied ? "Copié !" : "Copier"}
                </button>

                <button
                  onClick={handleDownload}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary-blue)",
                    cursor: "pointer",
                    fontSize: "0.8rem",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  <i className="fa-solid fa-download"></i> .TXT
                </button>
              </div>
            )}
          </div>

          {generatedResult ? (
            <div
              className="result-content"
              style={{
                whiteSpace: "pre-wrap",
                color: "var(--text-main)",
                fontSize: "0.95rem",
                lineHeight: "1.6",
                textAlign: "justify",
              }}
            >
              {generatedResult}
            </div>
          ) : (
            <div className="empty-result" style={{ textAlign: "center" }}>
              {isGenerating ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                  <SolidBlackLoader size="40px" />
                  <p style={{ color: "#000", fontWeight: "600" }}>L'IA rédige votre contenu...</p>
                </div>
              ) : (
                <>
                  <div className="empty-icon">
                    <i className="fa-solid fa-sparkles"></i>
                  </div>
                  <p>Votre contenu apparaîtra ici</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <br /><br /><br />
    </div>
  );
}