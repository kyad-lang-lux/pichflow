import React from 'react';
import Link from 'next/link';

export default function TOSPage() {
  return (
    <div className="legal-container">
      <div className="legal-content">
        <Link href="/" className="back-link">
          <i className="fa-solid fa-arrow-left"></i> Retour à l'accueil
        </Link>
        
        <h1>Conditions d'utilisation</h1>
        <p className="last-update">Dernière mise à jour : 21 Décembre 2025</p>

        <section>
          <h2>1. Acceptation des conditions</h2>
          <p>
            En accédant et en utilisant la plateforme <strong>PichFlow</strong>, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
          </p>
        </section>

        <section>
          <h2>2. Description des services</h2>
          <p>
            PichFlow est une plateforme SaaS fournissant des outils basés sur l'Intelligence Artificielle pour le marketing et le copywriting, ainsi que des outils de gestion financière (facturation et comptabilité simplifiée).
          </p>
        </section>

        <section>
          <h2>3. Utilisation de l'Intelligence Artificielle</h2>
          <p>
            PichFlow utilise des modèles d'IA pour générer du contenu. Bien que nous nous efforcions de fournir des résultats de haute qualité :
          </p>
          <ul>
            <li>L'utilisateur est seul responsable de la vérification de l'exactitude du contenu généré.</li>
            <li>PichFlow ne garantit pas que le contenu généré est exempt d'erreurs ou adapté à un usage spécifique.</li>
            <li>L'utilisateur conserve la propriété du contenu généré, sous réserve du respect des lois sur le droit d'auteur.</li>
          </ul>
        </section>

        <section>
          <h2>4. Responsabilité financière</h2>
          <p>
            Les outils de facturation et de comptabilité sont fournis à titre d'aide à la gestion. 
            <strong>PichFlow n'est pas un cabinet d'expertise comptable.</strong> L'utilisateur est responsable de la conformité légale et fiscale de ses factures et de ses déclarations financières auprès des autorités compétentes.
          </p>
        </section>

        <section>
          <h2>5. Comptes et Sécurité</h2>
          <p>
            Vous êtes responsable de la confidentialité de vos identifiants de connexion. Toute activité effectuée sous votre compte est de votre responsabilité. PichFlow s'engage à protéger vos données conformément à notre Politique de Confidentialité.
          </p>
        </section>

        <section>
          <h2>6. Abonnements et Paiements</h2>
          <p>
            Les services sont facturés sur une base d'abonnement (mensuel ou annuel). 
          </p>
          <ul>
            <li><strong>Essai gratuit :</strong> Limité à 7 jours. À l'issue de cette période, l'accès sera restreint sauf souscription à un plan payant.</li>
            <li><strong>Annulation :</strong> Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord.</li>
            <li><strong>Remboursement :</strong> Sauf disposition contraire de la loi, les paiements ne sont pas remboursables.</li>
          </ul>
        </section>

        <section>
          <h2>7. Limitation de responsabilité</h2>
          <p>
            PichFlow ne pourra être tenu responsable des dommages indirects, pertes de données ou pertes de profits résultant de l'utilisation ou de l'incapacité d'utiliser la plateforme.
          </p>
        </section>

        <section>
          <h2>8. Modifications des conditions</h2>
          <p>
            Nous nous réservons le droit de modifier ces conditions à tout moment. Les utilisateurs seront informés des changements majeurs via la plateforme ou par email.
          </p>
        </section>
      </div>
    </div>
  );
}