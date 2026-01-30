export default function Home() {
  return (
    
    <main>
      <section className="hero" id="top">
        {/* Badge animé */}
        <div className="badge reveal">
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          Gérez vos activités facilement
        </div>

        {/* Titre animé */}
        <h1 className="reveal delay-1">
          Votre moteur de  <br />
  <span>croissance et de gestion </span> <br />
  en un seul endroit
        </h1> 
 
        {/* Sous-titre animé */}
        <p className="reveal delay-2">
          PichFlow vous permet de faire du contenu marketing et copywriting. Il vous aide aussi à faire la facturation et la comptabilité. Une solution tout-en-un pour tous.
        </p>

        {/* Boutons animés */} 
        <div className="hero-btns reveal delay-3">
          <a href="/inscription" className="btn-primary">
            Démarrer l'essai gratuit <i className="fa-solid fa-play"></i>
          </a>
          <a href="#features" className="btn-outline">
            Découvrir les fonctionnalités <i className="fa-solid fa-compass"></i>
          </a> 
        </div> 
        <div className="hero-social reveal delay-3">
  <div className="avatar-group">
    <div className="avatar"><img src="https://i.pravatar.cc/100?u=1" alt="user" /></div>
    <div className="avatar"><img src="https://i.pravatar.cc/100?u=2" alt="user" /></div>
    <div className="avatar"><img src="https://i.pravatar.cc/100?u=3" alt="user" /></div>
    <div className="avatar"><img src="https://i.pravatar.cc/100?u=4" alt="user" /></div>
  </div>
  
  <div className="social-text">
    <span className="count">+2,500 utilisateurs</span>
    <div className="stars">
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <i className="fa-solid fa-star"></i>
      <span className="rating">4.9/5</span>
    </div>
  </div>
</div>
      </section>

      <section className="dashboard-preview reveal delay-3">
  <div className="preview-container">
    {/* Image principale du Dashboard */}
    <img 
      src="/img/dashboard-preview.png" 
      alt="Aperçu du Dashboard PitchFlow" 
      className="main-preview"
    />
    
    {/* On peut ajouter des petits éléments flottants pour le design */}
    <div className="floating-card update-card">
      <i className="fa-solid fa-check-circle"></i> Mise à jour effectuée
    </div>
    <div className="floating-card export-card">
      <i className="fa-solid fa-file-export"></i> Rapport prêt à exporter
    </div>
  </div>
</section>

<section id="features" className="features reveal">
  <div className="features-header">
    <h2>Fonctionalités de la <span> plateforme </span></h2>
    <p>PichFlow combine les outils essentiels pour les freelances et PME : marketing, copywriting et gestion financière propulsés par l'IA.</p>
  </div> 

  <div className="features-grid"> 
    {/* Carte 1 */}
    <div className="feature-card">
      <div className="icon-box blue"><i className="fa-solid fa-bolt-lightning"></i></div>
      <h3>Contenu Marketing</h3>
      <p>Générez des articles de blog SEO, posts réseaux sociaux et emails marketing en quelques clics.</p>
    </div>

    {/* Carte 2 */} 
    <div className="feature-card">
      <div className="icon-box orange"><i className="fa-solid fa-pen-nib"></i></div>
      <h3>Copywriting</h3>
      <p>Créez des pages de vente, landing pages et textes publicitaires avec les méthodes AIDA, PAS et plus.</p>
    </div> 

    {/* Carte 3 - Bordure bleue comme sur l'image */}
    <div className="feature-card active-border">
      <div className="icon-box blue-alt"><i className="fa-solid fa-file-invoice-dollar"></i></div>
      <h3>Facturation Automatisée</h3>
      <p>Créez devis et factures rapidement avec suivi des paiements et rappels automatiques.</p>
    </div>

    {/* Carte 4 */}
    <div className="feature-card">
      <div className="icon-box orange-alt"><i className="fa-solid fa-chart-column"></i></div>
      <h3>Comptabilité et rapport</h3>
      <p>Catégorisation automatique des revenus et dépenses avec alertes financières intelligentes.</p>
    </div>

    {/* Carte 5 */}
    <div className="feature-card">
      <div className="icon-box blue"><i className="fa-solid fa-envelope"></i></div>
      <h3>Multi-plateformes</h3>
      <p>Contenu prêt à être publié sur vos réseaux sociaux</p>
    </div>

   
  </div>
  


  <br /> <br /> 
<div className="features-tt-container reveal">
  <div className="features-tt-slider">
    {/* Groupe original */}
    <div className="sub1">
      <i className="fa-regular fa-file-pdf"></i>
      <div className="sub1-content">
        <span>Export PDF</span>
        <p>Générez des documents pros en un clic.</p>
      </div>
    </div>
    <div className="sub1">
      <i className="fa-solid fa-chart-line"></i>
      <div className="sub1-content">
        <span>Rapports mensuels</span>
        <p>Analysez votre croissance en temps réel.</p>
      </div>
    </div>
    <div className="sub1">
      <i className="fa-solid fa-bolt"></i>
      <div className="sub1-content">
        <span>Notifications</span>
        <p>Restez alerté de chaque paiement reçu.</p>
      </div>
    </div>
    <div className="sub1">
      <i className="fa-solid fa-shield-halved"></i>
      <div className="sub1-content">
        <span>Sécurité</span>
        <p>Vos données sont cryptées et protégées.</p>
      </div>
    </div>
    
    {/* Doublon pour la boucle infinie */}
    <div className="sub1">
      <i className="fa-regular fa-file-pdf"></i>
      <div className="sub1-content">
        <span>Export PDF</span>
        <p>Générez des documents pros en un clic.</p>
      </div>
    </div>
    <div className="sub1">
      <i className="fa-solid fa-chart-line"></i>
      <div className="sub1-content">
        <span>Rapports mensuels</span>
        <p>Analysez votre croissance en temps réel.</p>
      </div>
    </div>
    <div className="sub1">
      <i className="fa-solid fa-bolt"></i>
      <div className="sub1-content">
        <span>Notifications</span>
        <p>Restez alerté de chaque paiement reçu.</p>
      </div>
    </div>
    <div className="sub1">
      <i className="fa-solid fa-shield-halved"></i>
      <div className="sub1-content">
        <span>Sécurité</span>
        <p>Vos données sont cryptées et protégées.</p>
      </div>
    </div>
  </div>
</div>


{/* 
  <div className="features-footer reveal delay-2">
  <div className="sub-badge">
    <i className="fa-regular fa-file-pdf"></i> Export PDF 
  </div>
  <div className="sub-badge">
    <i className="fa-solid fa-chart-line"></i> Rapports mensuels
  </div>
  <div className="sub-badge">
    <i className="fa-solid fa-bolt"></i> Notifications temps réel
  </div>
  <div className="sub-badge">
    <i className="fa-solid fa-shield-halved"></i> Données sécurisées
  </div>
</div> */}

</section>

{/* --- SECTION COMMENT ÇA MARCHE --- */}
<section className="how-it-works reveal">
  <div className="features-header">
    <h2>Démarrer en <span>3 étapes simples</span></h2>
    <p>Pas de configuration complexe. Commencez à produire en moins de 2 minutes.</p>
  </div>

  <div className="steps-grid">
    <div className="step-card">
      <div className="step-num">1</div>
      <div className="step-icon"><i className="fa-solid fa-hand-pointer"></i></div>
      <h4>Sélectionnez un outil</h4>
      <p>Choisissez entre la génération de contenu IA ou l'outil de facturation pro.</p>
    </div>

    <div className="step-card">
      <div className="step-num">2</div>
      <div className="step-icon"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
      <h4>Saisissez vos données</h4>
      <p>L'IA génère vos textes marketing ou calcule vos rapports financiers instantanément.</p>
    </div>

    <div className="step-card">
      <div className="step-num">3</div>
      <div className="step-icon"><i className="fa-solid fa-circle-check"></i></div>
      <h4>Exportez et utilisez</h4>
      <p>Téléchargez vos factures en PDF ou publiez vos contenus directement.</p>
    </div>
  </div>


  
</section>

<section className="showcase-section reveal">
  <div className="showcase-container">
    {/* Colonne Texte */}
    <div className="showcase-text">
      <h2>Gérez tout votre <span>écosystème</span> business</h2>
      <p>
        De la rédaction de vos publicités à l'encaissement de vos factures, 
        PitchFlow centralise vos outils pour vous laisser vous concentrer sur l'essentiel.
      </p>
      <ul className="showcase-list">
        {/* <li><i className="fa-solid fa-check"></i> Automatisation intelligente</li> */}
        <li><i className="fa-solid fa-check"></i> Interface ultra-fluide</li>
        <li><i className="fa-solid fa-check"></i> Support disponible 24/7</li>
      </ul>
    </div>
 
    {/* Colonne Visuelle (Inspirée de l'image Payoneer) */}
    <div className="showcase-visual">
      <div className="circle-bg"></div>
      
      {/* Image de la personne (Remplace par ta propre image si besoin) */}
      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="Entrepreneur" className="person-img" />

      {/* Badges Flottants */}
      <div className="floating-badge badge-top-left">
        <div className="badge-logo"><i className="fa-solid fa-wand-magic-sparkles"></i></div>
        <div className="badge-content">
          <span>PitchFlow AI</span>
          <small>Marketing Engine</small>
        </div>
      </div>

      <div className="floating-badge badge-mid-right">
        <div className="badge-logo-globe"><i className="fa-solid fa-earth-africa"></i></div>
      </div>

      <div className="floating-badge badge-bottom-left">
        <div className="badge-icon-check"><i className="fa-solid fa-check"></i></div>
        <div className="badge-content">
          <span className="amount">500 €</span>
          <small>Payée</small>
        </div>
      </div>

      {/* Petits points décoratifs */}
      <div className="dot dot-1"></div>
      <div className="dot dot-2"></div>
    </div>
  </div>
</section>

{/* --- SECTION CTA FINAL --- */} 
<section className="final-cta reveal">
  <div className="cta-content">
    <h2>Prêt à propulser votre activité ?</h2>
    <p>Rejoignez plus de 2,500 professionnels qui automatisent leur quotidien avec PitchFlow.</p>
    <div className="hero-btns">
      <a href="/inscription" className="btn-white">
        Essayer gratuitement <i className="fa-solid fa-rocket"></i>
      </a>
    </div>
    <span className="no-card">Aucune carte de crédit requise pour l'essai.</span>
  </div>
</section>


<section id="pricing" className="pricing reveal">
  <div className="pricing-header">
    <h2>Des tarifs <span>simples et flexibles</span></h2>
    <p>Essayez gratuitement pendant 7 jours, puis rechargez vos crédits selon vos besoins.</p>
  </div>

  <div className="pricing-grid">
    {/* Plan Essai Gratuit - 7 Jours */}
    <div className="pricing-card">
      <h3>Essai Gratuit</h3>
      <div className="price">0€<span>/7 jours</span></div>
      <p className="price-desc">Testez la puissance de PichFlow sans engagement</p>
      <ul className="price-features">
        <li><i className="fa-solid fa-circle-check"></i> 10 crédits inclus pour tester</li>
        <li><i className="fa-solid fa-circle-check"></i> Accès complet aux outils IA</li>
        <li><i className="fa-solid fa-circle-check"></i>Makerting & Copywriting </li>
        <li><i className="fa-solid fa-circle-check"></i> Facturation & rapports</li>
      </ul>
      <button className="btn-outline-pricing">Essai gratuit</button>
    </div>

    {/* Plan 50 Crédits - Recommandé */}
    <div className="pricing-card featured">
      <div className="popular-badge"><i className="fa-solid fa-bolt"></i> Plus Populaire</div>
      <h3>Pack Essentiel</h3>
      <div className="price">5€<span>/100 crédits</span></div>
      <p className="price-desc">Idéal pour vos besoins </p>
      <ul className="price-features">
        <li><i className="fa-solid fa-circle-check"></i> <strong>100 crédits</strong> automatique</li>
        <li><i className="fa-solid fa-circle-check"></i> Génération de contenu haute qualité</li>
        <li><i className="fa-solid fa-circle-check"></i> Accès illimité aux differents outils</li>
        <li><i className="fa-solid fa-circle-check"></i> Export PDF disponible</li>
      </ul>
      <button className="btn-primary-pricing">+ 100 crédits</button>
    </div>

    {/* Plan 100 Crédits - Meilleure Valeur */}
    <div className="pricing-card">
      <h3>Pack Business</h3>
      <div className="price">8€<span>/200 crédits</span></div>
      <p className="price-desc">Economique et approprié</p>
      <ul className="price-features">
        <li><i className="fa-solid fa-circle-check"></i> <strong>200 crédits</strong> automatique</li>
        <li><i className="fa-solid fa-circle-check"></i> Économisez 20% sur le prix</li>
        <li><i className="fa-solid fa-circle-check"></i> Génération de contenu haute qualité</li>
        <li><i className="fa-solid fa-circle-check"></i> Export PDF disponible</li>
      </ul>
      <button className="btn-blue-pricing">+ 200 crédits</button>
    </div>
  </div>



  <div className="pricing-trust reveal delay-2">
    <p>Recharges sécurisées via nos partenaires</p>
    <div className="trust-badges">
      <div className="trust-card">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
          alt="Stripe" 
          style={{ height: '25px' }} 
        />
      </div>
      <div className="trust-card">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" 
          alt="PayPal" 
          style={{ height: '25px' }} 
        />
      </div>
      <div className="trust-card">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" 
          alt="Visa" 
          style={{ height: '15px', marginRight: '10px' }} 
        />
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" 
          alt="Mastercard" 
          style={{ height: '20px' }} 
        />
      </div>
    </div>

</div> 
</section>

<div id="top"></div>

<a href="#top" className="back-to-top" aria-label="Retour en haut">
  <i className="fa-solid fa-chevron-up"></i>
</a>
    </main>
  ); 
}