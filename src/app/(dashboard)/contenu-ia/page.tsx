"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function ContenuIAPage() {
  // 1️⃣ États pour les entrées du formulaire
  const [selectedType, setSelectedType] = useState("Article de blog SEO");
  const [tone, setTone] = useState("Professionnel");
  const [prompt, setPrompt] = useState("");

  // 2️⃣ États pour la gestion de la génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const contentTypes = [
    { id: "blog", label: "Article de blog SEO", icon: "fa-file-lines" },
    { id: "social", label: "Réseau sociaux", icon: "fa-share-nodes" },
    { id: "email", label: "Email marketing", icon: "fa-envelope" },
    { id: "video", label: "Script vidéo", icon: "fa-video" },
  ];

  // Composant Loader Noir Solid
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
        {`@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );

  // Fonction de nettoyage (garde accents et apostrophes)
  const cleanFormat = (text: string): string => {
    return text
      .replace(/[#*`_~|>]/g, "") // Supprime les symboles Markdown
      .replace(/\n{3,}/g, "\n\n") // Évite les trop grands espaces
      .trim();
  };

  const handleCopy = async () => {
    if (!generatedResult) return;
    await navigator.clipboard.writeText(generatedResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pichflow-${selectedType
      .toLowerCase()
      .replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 🔹 Fonction principale de génération directement côté client
  const handleGenerate = async () => {
    if (!prompt) return alert("Veuillez décrire un sujet !");

    if (!process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY) {
      return alert(
        "Clé API Google manquante. Vérifiez vos variables d'environnement."
      );
    }

    setIsGenerating(true);
    setGeneratedResult("");

    const systemInstructions = `Tu es un expert en marketing digital. 
Rédige un(e) ${selectedType} avec un ton ${tone}.
IMPORTANT : Ne fournis que le texte brut. N'utilise AUCUN symbole Markdown (pas de # ou de *). 
CONSIGNE STRICTE : Respecte parfaitement les accents (é, à, è, etc.) et les apostrophes. 
Le texte doit être clair, aéré et professionnel.`;

    try {
      // ⚡ Initialisation du client Google Generative AI
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY || ""
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-flash-latest",
        systemInstruction: systemInstructions,
      });

      // 🔹 Génération du contenu
      const result = await model.generateContent(`Sujet : ${prompt}`);
      const text = (await result.response).text();

      setGeneratedResult(cleanFormat(text));
    } catch (error: any) {
      console.error("ERREUR GOOGLE AI:", error);
      if (error.message?.includes("403")) {
        alert(
          "Clé API bloquée ou compromise. Veuillez utiliser une nouvelle clé."
        );
      } else if (error.message?.includes("429")) {
        alert("Trop de requêtes. Patientez quelques secondes.");
      } else {
        alert("Erreur serveur IA. Voir console pour détails.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ia-page-container">
      {/* Colonne de gauche : Configuration */}
      <div className="ia-config-side">
        <div className="config-section">
          <h4>Type de contenu</h4>
          <div className="type-grid">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                className={`type-card ${
                  selectedType === type.label ? "active" : ""
                }`}
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
          <select
            className="ia-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {isGenerating ? (
            <>
              <SolidBlackLoader size="16px" /> Génération...
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles"></i> Générer le
              contenu
            </>
          )}
        </button>
      </div>

      {/* Colonne de droite : Aperçu/Résultat */}
      <div className="ia-result-side" style={{ height: "100%" }}>
        <div
          className="result-card"
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "15px",
            }}
          >
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
                  <i
                    className={
                      isCopied ? "fa-solid fa-check" : "fa-regular fa-copy"
                    }
                  ></i>{" "}
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <SolidBlackLoader size="40px" />
                  <p style={{ color: "#000", fontWeight: "600" }}>
                    L'IA rédige votre contenu...
                  </p>
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
      <br />
      <br />
      <br />
    </div>
  );
}