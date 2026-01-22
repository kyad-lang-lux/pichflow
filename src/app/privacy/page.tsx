import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <Link href="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Retour à l'accueil
        </Link>
        
        <h1>Politique de confidentialité</h1>
        <p className="last-update">Dernière mise à jour : 21 Décembre 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Chez <strong>PichFlow</strong>, nous prenons la protection de vos données personnelles très au sérieux. Cette politique détaille comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez nos services de marketing par IA et de gestion financière.
          </p>
        </section>

        <section>
          <h2>2. Données collectées</h2>
          <p>Nous collectons les informations nécessaires pour fournir nos services, notamment :</p>
          <ul>
            <li><strong>Informations de compte :</strong> Nom, adresse email, mot de passe.</li>
            <li><strong>Données professionnelles :</strong> Nom de l'entreprise, adresse de facturation, numéro de TVA.</li>
            <li><strong>Données de contenu :</strong> Les textes et requêtes que vous soumettez à l'IA pour le copywriting.</li>
            <li><strong>Données financières :</strong> Historique des factures et dépenses (nous n'enregistrons pas vos coordonnées bancaires directement).</li>
          </ul>
        </section>

        <section>
          <h2>3. Utilisation des données</h2>
          <p>Vos données sont utilisées exclusivement pour :</p>
          <ul>
            <li>Générer votre contenu marketing et vos rapports financiers.</li>
            <li>Gérer vos abonnements et la facturation via nos prestataires (Stripe/PayPal).</li>
            <li>Améliorer nos algorithmes d'IA (sous forme anonymisée uniquement).</li>
            <li>Vous envoyer des notifications importantes sur votre compte.</li>
          </ul>
        </section>

        <section>
          <h2>4. Sécurité des transactions financières</h2>
          <p>
            Comme indiqué sur notre plateforme, nous utilisons des passerelles de paiement sécurisées (Stripe et PayPal). 
            <strong>PichFlow ne stocke jamais vos numéros de carte bancaire</strong> sur ses propres serveurs. Toutes les transactions sont chiffrées selon les normes de sécurité PCI-DSS.
          </p>
        </section>

        <section>
          <h2>5. Conservation et Protection</h2>
          <p>
            Vos données sont stockées sur des serveurs sécurisés et ne sont jamais vendues à des tiers. Nous conservons vos données aussi longtemps que votre compte est actif ou selon les obligations légales en vigueur (notamment pour les documents comptables).
          </p>
        </section>

        <section>
          <h2>6. Vos droits (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Vous pouvez exercer ces droits directement depuis vos paramètres de profil ou en nous contactant.
          </p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>
            Pour toute question concernant cette politique, vous pouvez nous contacter à l'adresse dédiée à la protection des données de PichFlow.
          </p>
        </section>
      </div>
    </div>
  );
}