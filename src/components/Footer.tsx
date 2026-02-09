import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        {/* Colonne Logo & Description */}
        <div className="footer-brand">
          <div className="footer-logo">
            
            <Link href="/" className="logo" >
        <div className="logo-icon">
          <i className="fa-solid fa-circle-nodes"></i>
        </div>
        <span className="logo-text">
          Pich<span className="blue-text">.Flow</span>
        </span>
      </Link>
          </div>
          <p>
            La plateforme tout-en-un pour les freelances, particuliers et PME. 
            Marketing IA, Copywriting, Factures et comptabilité automatisée.
          </p>
        </div>

       

        {/* Colonne Légal */}
        <div className="footer-links">
          <h4>Infos</h4>
          <ul>
            <li><Link href="/tos">Conditions d'utilisation</Link></li>
            <li><Link href="/privacy">Politique de confidentialité</Link></li>
            <li><Link href="/support">Support</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 PichFlow. Tous droits réservés.</p>
        <div className="social-icons">
          <Link href="#"><i className="fa-brands fa-twitter"></i></Link>
          <Link href="#"><i className="fa-brands fa-linkedin"></i></Link>
        </div>
      </div>
    </footer>
  );
};