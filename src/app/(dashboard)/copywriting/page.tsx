"use client";

import React, { useState } from "react";
import { getGoogleAIModel } from "./generateCopywriting";

export default function CopywritingPage() {
  // 1️⃣ États du formulaire
  const [activeMethod, setActiveMethod] = useState("AIDA");
  const [type, setType] = useState("Page de vente");
  const [product, setProduct] = useState("");
  const [target, setTarget] = useState("");
  const [objective, setObjective] = useState("Professionnel");
  const [textLength, setTextLength] = useState("400-600"); // <- Nouvel état pour longueur

  // 2️⃣ États génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const methods = [
    { id: "AIDA", title: "AIDA", desc: "Attention, Interest, Desire, Action" },
    { id: "PAS", title: "PAS", desc: "Problem, Agitation, Solution" },
    { id: "BAB", title: "BAB", desc: "Avant, Après, Pont" },
  ];

  // Loader Noir Solid
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

  // 🔹 Fonction de nettoyage sécurisée
  const cleanFormat = (text: string): string =>
    text.replace(/^#+\s*/gm, "").replace(/[*_~`]/g, "").replace(/\n{3,}/g, "\n\n").trim();

  // 🔹 Copier dans le presse-papiers
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
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Erreur copie:", err);
    }
  };

  // 🔹 Télécharger en .txt
  const handleDownload = () => {
    if (!generatedResult) return;
    const blob = new Blob([generatedResult], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `copy-${activeMethod.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 🔹 Génération IA
  const handleGenerate = async () => {
    if (!product) return alert("Veuillez décrire votre produit !");
    setIsGenerating(true);
    setGeneratedResult("");

    const systemInstructions = `
Tu es un modèle expert en copywriting émotionnel optimisé pour Facebook et Instagram.

🎯 OBJECTIF PRINCIPAL  
Générer un contenu persuasif, basé sur AIDA + PAS, avec un ton motivant, direct, émotionnel et accessible.

📌 RÈGLES D'ÉCRITURE  
- Tu tutoies le lecteur.  
- Tu utilises beaucoup de verbes d’action.  
- Tes phrases sont courtes et percutantes.  
- Tu utilises des métaphores simples.  
- Tu ajoutes des emojis pertinents mais pas trop.  
- Tu rassures le lecteur à chaque obstacle.  
- Tu donnes des exemples concrets.  
- Tu termines par un CTA fort.  

📌 LONGUEUR DU TEXTE  
Le texte généré doit être entre ${textLength} mots maximum.

📌 STYLEs EXACTS À IMITER 

=== STYLE 1 ===
[Tu crois encore qu’un site web, c’est “optionnel” ?

Laisse-moi te poser une question simple :
Si demain quelqu’un entend parler de toi… il fait quoi ?
Il tape ton nom sur Google.

Et là… soit il tombe sur quelque chose de propre, clair, rassurant.
Soit il tombe sur… rien.

Ou pire : des infos éparpillées, des avis perdus, aucun moyen de te contacter.

Et tu viens de perdre un client. Sans même le savoir.

---

Le vrai problème, il est là.

Tu travailles dur.
Tu développes ton activité.
Tu investis du temps, de l’énergie, parfois même de l’argent.

Mais tu laisses ton image en ligne… au hasard.

👉 C’est comme avoir un restaurant sans enseigne.
👉 Ou une boutique sans vitrine.

Les gens passent… mais ne rentrent pas.

---

Maintenant, soyons honnêtes.

Tu t’es déjà dit :
“Oui mais un site web, ça coûte cher…”
“Je peux me contenter de Facebook…”
“Je verrai plus tard…”

C’est exactement ce que tout le monde pense.

Et c’est pour ça que ceux qui ont un site bien fait prennent l’avantage.

---

Regarde la réalité en face :

Un site web, ce n’est pas un luxe.
C’est un outil de conversion.

✔ Il travaille pour toi 24h/24
✔ Il rassure tes prospects
✔ Il centralise toutes tes informations
✔ Il transforme un simple visiteur en client

Pendant que toi, tu dors… lui, il vend.

---

Imagine ça une seconde :

Un client potentiel tombe sur ton site.

Il voit :

- Ce que tu proposes (clair et structuré)
- Des preuves sociales (avis clients, résultats)
- Un design propre (tu inspires confiance)
- Un bouton pour te contacter immédiatement

Tu viens de transformer une curiosité… en opportunité réelle.

---

Maintenant, imagine l’inverse.

Il cherche ton nom.

Il ne trouve rien de concret.
Ou alors des informations confuses.

Tu sais ce qu’il fait ?

👉 Il part chez quelqu’un d’autre.

Pas parce que tu es moins bon.
Mais parce que tu es invisible.

---

Et c’est là que tout se joue.

Tu n’as pas besoin d’un “site web”.

Tu as besoin d’un système.

Un système qui :

- Attire
- Rassure
- Convainc
- Convertit

C’est là toute la différence entre
👉 “être présent en ligne”
et
👉 “gagner de l’argent grâce à internet”

---

Je vais être direct avec toi :

Si aujourd’hui tu n’as pas de site…
tu laisses de l’argent sur la table.

Tous les jours.

---

Bonne nouvelle :

Tu n’as pas besoin de comprendre le code.
Tu n’as pas besoin de te casser la tête.

Ton seul job, c’est de savoir où tu veux aller.

Le mien, c’est de construire l’outil qui t’y emmène.

---

Ce que je fais concrètement :

Je ne te crée pas juste un “beau site”.

Je crée un site qui :

- Parle à tes clients
- Répond à leurs objections
- Met en valeur ton activité
- Et surtout… te génère des résultats

---

La vraie question maintenant, c’est pas :
“Est-ce que tu as besoin d’un site ?”

La vraie question, c’est :
👉 Combien de clients es-tu prêt à perdre avant de passer à l’action ?

---

Si tu veux passer au niveau supérieur,
si tu veux arrêter d’être invisible,
si tu veux un outil qui travaille pour toi…

Alors envoie-moi un message.

On va construire quelque chose qui rapporte. Pas juste quelque chose qui existe.]


=== STYLE 2 ===
[Il y a quelques années, j'étais assis dans ma chambre avec un téléphone, zéro compétence technique, et une seule question en tête :  
Comment je fais pour m'en sortir ?  
Pas de PC. Pas de réseau. Pas de formation. Manque cruel d'argent.  
Juste l'envie et la frustration de voir les autres avancer pendant que moi, je tournais en rond.  

Si tu lis ça aujourd'hui, je sais exactement ce que tu vis.  
Tu veux gagner ta vie, mais tu ne sais pas par où commencer.  
Tu vois des gens facturer 200K, 300K, 500K par mois et toi tu galères à réunir 50K.  

On t'a dit qu'il fallait un PC, du code, des diplômes pour réussir dans le digital.  
Tu as regardé des tutos YouTube. Tu as abandonné. Tu as recommencé. Tu as encore abandonné.  

Je suis passé par tout ça.  
Mais aujourd'hui, j'ai créé plus de 100 sites web et généré plusieurs milliers d’euros.  

Toi aujourd’hui, tu ne seras plus en face de ces contraintes car j'ai découvert une méthode qui change absolument tout.  
Ce qui prenait des semaines prend quelques heures, ce qui coûtait des centaines de milliers de francs est gratuit.  
Et surtout, tu peux le faire depuis ton téléphone.  

J'ai donc décidé de tout mettre dans un seul programme.  
Sur ce PHANTOM BUILD est officiellement ouvert.  

Ce que tu vas recevoir :  
→ Une méthode complète pour créer des sites professionnels depuis ton téléphone  
→ Comment déployer tes sites en ligne gratuitement  
→ Une masterclass exclusive avec des boss de ComeUp : Rachid Agbandou, Paul Bordas Douvi et Gerard Togan pour décrocher tes premiers clients sur ComeUp  
→ Un groupe privé où j'analyse personnellement tes créations  
→ Des lives, du suivi, et une communauté qui avance ensemble  
→ Et bien d'autres bonus comme des stratégies de création de contenu avec Fritzel Adjaho  

Le prix normal : 21 300 FCFA.  
Le prix de lancement aujourd'hui : 10 200 FCFA pour seulement les 10 premières personnes.  

Je ne te vends pas un rêve.  
Je te donne exactement la méthode que j'utilise chaque jour pour vivre de la création de sites web.  
La même méthode, les mêmes outils, les mêmes techniques.  

La seule différence entre toi et ceux qui facturent déjà, c'est une décision.  
Celle que tu prends maintenant — ou celle que tu regretteras dans 6 mois.  

Lien dans le commentaire 👇  
Satisfait ou remboursé. Zéro risque. Tout à gagner.  

PHANTOM BUILD — Ton téléphone. L'IA. Tes premiers revenus.  
C'était Carlos Djanato le DevCloser 🧠🔥]


=== STYLE 3 ===
[Pendant longtemps, on a appris à attendre.  
Attendre un concours.  
Attendre un recrutement.  
Attendre qu’une entreprise nous appelle.  

Pendant ce temps, Internet évoluait.  
Des personnes, ailleurs, ont compris une chose simple :  
On peut transformer une compétence en produit digital.  
On peut vendre en ligne.  
On peut créer ses propres revenus.  

Il y a presque un an, j’ai adopté ce business model.  
En 11 jours, j’ai généré mon premier million en ligne.  
Pas grâce à la chance.  
Pas grâce à un financement.  
Grâce à une méthode claire.  

Ce système a changé ma trajectoire.  
Je suis passée de freelance qui se débrouillait à entrepreneure avec des employés.  

Et pourtant…  
Je suis convaincue qu’il y a des personnes ici plus compétentes que moi.  

La vérité, c’est que beaucoup d’entre nous ont déjà une compétence :  
• On cuisine  
• On forme  
• On conseille  
• On maquille  
• On fait du marketing  
• On a une expertise  

Mais on ne sait pas la monétiser.  
Ce n’est pas un problème de talent.  
C’est un problème de compréhension du système.  

Je ne te promets pas des millions.  
Je te promets une compréhension du système.  

Et quand tu comprends le système :  
• Gagner 2 000 F par jour devient structuré  
• Gagner 100 000 F par mois devient planifiable  

Les produits digitaux ne demandent :  
• Ni local  
• Ni stock  
• Ni capital énorme  

Ils demandent :  
• Un téléphone  
• Une connexion  
• Une méthode  

Imagine dans 3 mois…  
Comprendre enfin comment transformer ce que tu sais déjà faire en revenu.  
Savoir quoi publier.  
Savoir quoi vendre.  
Savoir comment lancer une publicité sans improviser.  
Ne plus observer ceux qui encaissent.  
Mais faire partie de ceux qui comprennent le système.  

C’est pour ça que j’ouvre Digital Addict Sellers.  
Les 28 & 29 mars, en présentiel.  

On va apprendre à :  
• Comprendre le business model des produits digitaux  
• Transformer une compétence en produit rentable  
• Créer du contenu pour vendre en organique  
• Lancer des Facebook Ads efficacement  

⚠️ 20 places seulement  
💰 50 000 FCFA  

La prochaine étape dépend maintenant de toi. 🙌🏾]

=== STYLE 4 ===
[Tu as déjà remarqué comment deux personnes, presque identiques, peuvent finir dans deux mondes complètement différents ?  

Ils ont les mêmes diplômes, la même éducation, les mêmes diplômes.  
Leur histoire a commencé exactement de la même façon.  

Mais aujourd’hui, l’un est en haut de l’échelle.  
Il dirige une équipe, prend des décisions, vit la vie qu’il a choisie.  
L’autre se débrouille. Il paie les factures. Il espère une occasion.  

Quelle est la différence ?  

Ce n’est ni la chance.  
Ce n’est ni le talent.  
Ce n’est même pas les opportunités.  

La différence, c’est une décision.  

Celle de ne plus laisser les choses au hasard.  
Celle de prendre le contrôle.  
Celle de choisir une stratégie qui marche encore et encore.  

Parce que pendant que certains restent bloqués à contempler leur situation, d’autres avancent, construisent, progressent. Ils refusent de laisser leurs rêves dépendre de “peut-être”. Ils les placent entre leurs mains.

👉 Et toi, où veux‑tu être demain ?  

Ce que je vais te proposer n’est pas une promesse vide.  
Ce n’est pas un rêve inaccessible.  
C’est une méthode éprouvée, réutilisée chaque jour par des centaines de personnes qui ont choisi de passer à l’action.  

Imagine pour une seconde…  
Un système clair, structuré, qui te guide pas à pas.  
Un plan que tu peux appliquer maintenant, aujourd’hui.  

Que ferais‑tu si tu savais que cette décision pouvait transformer ta trajectoire ?  
Que ferais‑tu si tu savais que tu pouvais vivre de ce que tu aimes ?  

Voici une opportunité simple :  
Prends la décision maintenant.  

💡 Passe à l’action.  
💡 Rejoins ceux qui décident de leur avenir.  
💡 Transforme ton quotidien en quelque chose de plus grand.  

👉 Clique maintenant pour découvrir comment ce système peut changer ta vie — avant que quelqu’un d’autre ne le fasse à ta place.]




IMPORTANT  
Tu ne dois jamais copier les textes mot pour mot.  
Tu dois uniquement imiter la structure, le ton, le rythme et l’énergie de tous les styles présentés ci-dessus.

`;

    const userPrompt = `Produit/Service : ${product}. Cible : ${target || "tout le monde"}. Objectif : ${objective}. Méthode : ${activeMethod}.`;

    try {
      const model = getGoogleAIModel(systemInstructions);
      const result = await model.generateContent(userPrompt);
      const text = (await result.response).text();
      setGeneratedResult(cleanFormat(text));
    } catch (error: any) {
      console.error("ERREUR GOOGLE AI:", error);
      if (error.message?.includes("403")) alert("Clé API bloquée ou invalide.");
      else if (error.message?.includes("429")) alert("Trop de requêtes. Patientez quelques secondes.");
      else alert("Erreur serveur IA. Voir console pour détails.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ia-page-container" style={{ width: "100%", overflowX: "hidden", paddingBottom: "40px" }}>
      {/* Configuration */}
      <div className="ia-config-side" style={{ padding: "20px", maxWidth: "100%" }}>
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
          <div className="method-grid" style={{ gap: "10px" }}>
            {methods.map((method) => (
              <div
                key={method.id}
                className={`method-card ${activeMethod === method.id ? "active" : ""}`}
                onClick={() => setActiveMethod(method.id)}
                style={{ padding: "12px", minWidth: "0", cursor: "pointer" }}
              >
                <span className="method-title" style={{ fontSize: "0.9rem" }}>{method.title}</span>
                <span className="method-desc" style={{ fontSize: "0.65rem" }}>{method.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="config-section">
          <h4>Produit / Service</h4>
          <textarea
            className="ia-textarea"
            placeholder="Décrivez votre produit..."
            style={{ width: "100%" }}
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
        </div>

        <div className="config-section">
          <h4>Cible</h4>
          <input
            type="text"
            className="ia-input"
            placeholder="Ex: Entrepreneurs..."
            style={{ width: "100%" }}
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>

        <div className="config-section">
          <h4>Objectif</h4>
          <select className="ia-select" value={objective} onChange={(e) => setObjective(e.target.value)}>
            <option>Professionnel</option>
            <option>Persuasif</option>
            <option>Urgent</option>
          </select>
        </div>

        {/* 🔹 Nouvelle section : Longueur du texte */}
        <div className="config-section">
          <h4>Longueur du texte (en mots)</h4>
          <select className="ia-select" value={textLength} onChange={(e) => setTextLength(e.target.value)}>
            <option value="200-300">200 - 300</option>
            <option value="400-600">400 - 600</option>
            <option value="600-800">600 - 800</option>
            <option value="800-1000">800 - 1000</option>
          </select>
        </div>

        <button
          className="btn-generate"
          onClick={handleGenerate}
          disabled={isGenerating}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          {isGenerating ? <><SolidBlackLoader size="16px" /> Génération...</> : <><i className="fa-solid fa-pen-nib"></i> Générer le copy</>}
        </button>
      </div>

      {/* Résultat */}
      <div className="ia-result-side" style={{ width: "100%", minWidth: "0" }}>
        <div className="result-card" style={{ padding: "20px", minHeight: "auto", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h4>Texte généré</h4>
            {generatedResult && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={handleCopy} style={{ background: "none", border: "none", color: isCopied ? "#10B981" : "var(--primary-blue)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
                  <i className={isCopied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i> {isCopied ? "Copié" : "Copier"}
                </button>
                <button onClick={handleDownload} style={{ background: "none", border: "none", color: "var(--primary-blue)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "bold" }}>
                  <i className="fa-solid fa-download"></i> .TXT
                </button>
              </div>
            )}
          </div>

          {generatedResult ? (
            <div className="result-content" style={{ whiteSpace: "pre-wrap", color: "var(--text-main)", fontSize: "0.95rem", lineHeight: "1.6", textAlign: "justify" }}>
              {generatedResult}
            </div>
          ) : (
            <div className="empty-result" style={{ padding: "30px", textAlign: "center" }}>
              {isGenerating ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                  <SolidBlackLoader size="40px" />
                  <p style={{ color: "#000", fontWeight: "500" }}>Rédaction du copy en cours...</p>
                </div>
              ) : (
                <>
                  <div className="empty-icon"><i className="fa-solid fa-pen-fancy"></i></div>
                  <p style={{ fontSize: "0.9rem" }}>Votre texte de vente apparaîtra ici</p>
                  <span className="empty-subtext" style={{ fontSize: "0.75rem" }}>Utilisez les méthodes AIDA, PAS ou BAB</span>
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