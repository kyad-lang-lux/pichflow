'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "@/app/dashboard.css";
// On importe les actions nécessaires
import { getUserCredits, logoutAction } from "@/app/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // On initialise les crédits avec un état "chargement"
  const [credits, setCredits] = useState<number | string>("..."); 

  useEffect(() => {
    // 1. Récupération des vrais crédits depuis Turso
    const fetchCredits = async () => {
      try {
        const val = await getUserCredits();
        setCredits(val);
      } catch (error) {
        console.error("Erreur lors de la récupération des crédits", error);
        setCredits(0);
      }
    };

    fetchCredits();

    // 2. Gestion du clic à l'extérieur pour fermer le menu profil
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allMenuItems = [
    { name: "Acceuil", path: "/dashboard", icon: "fa-house" },
    { name: "Devis", path: "/devis", icon: "fas fa-receipt" },
    { name: "Factures ", path: "/factures", icon: "fa-file-invoice-dollar" },
    { name: "Marketing ", path: "/contenu-ia", icon: "fa-handshake" },
    { name: "Copywriting ", path: "/copywriting", icon: "fa-lightbulb" },
    { name: "Rapports ", path: "/rapports", icon: "fa-chart-bar" },
    { name: "Paramètres ", path: "/parametres", icon: "fa-gear" },
  ];

  const sidebarPrimaryItems = allMenuItems.slice(0, 5);
  const sidebarSecondaryItems = allMenuItems.slice(5);

  const mobileMenuItems = allMenuItems.filter(
    (item) => item.name !== "Rapports " && item.name !== "Paramètres "
  );

  const activeItem = allMenuItems.find((item) => item.path === pathname);
  const activeTitle = activeItem ? activeItem.name : "Dashboard";

  // Fonction de déconnexion
  const handleLogout = async () => {
    await logoutAction(); // Supprime le cookie côté serveur
    window.location.href = "/"; // Redirige vers l'accueil
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/dashboard" className="logo">
            <span className="logo-text">
              <span className="ft">ll</span>Pich<span className="blue-text">Flow</span>
            </span>
          </Link>
        </div>

        <nav className="sidebar-menu">
          <div className="menu-group">
            {sidebarPrimaryItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`menu-item ${pathname === item.path ? "active" : ""}`}
              >
                <i className={`fa-solid ${item.icon}`}></i> {item.name}
              </Link>
            ))}
          </div>

          <div className="menu-group bottom">
            {sidebarSecondaryItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`menu-item ${pathname === item.path ? "active" : ""}`}
              >
                <i className={`fa-solid ${item.icon}`}></i> {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div className="topbar-left">
            <h1>
              <span>
                {activeTitle === "Paramètres"
                  ? "Gérez votre compte"
                  : "PichFlow"}{" "}
                -{" "}
              </span>
              {activeTitle}
            </h1>
          </div>

          <div className="topbar-right" ref={profileRef}>
            <button
              className="user-btn"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                padding: "3px 7px",
                borderRadius: "20px",
                background: "rgba(0,0,0,0.03)",
                border: "2px solid rgba(0,0,0,0.5)",
                cursor: "pointer"
              }}
            >
              <div
                className="credits-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.9rem",
                  fontWeight: "900",
                  color: "#000",
                  padding: "2px 6px",
                  background: "#fff",
                  borderRadius: "12px",
                }}
              >
                <i className="fa-solid fa-coins" style={{ color: "#000" }}></i>
                <span>{credits}</span>
              </div>

              <span style={{ color: "#000", fontSize: "20px" }} className="user-badge">
                <i className="fa-solid fa-bars"></i>
              </span>
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <Link
                  href="/parametres"
                  className="menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="fa-solid fa-user-gear"></i> Paramètres
                </Link>
                <Link
                  href="/buy-credits"
                  className="menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="fa-solid fa-coins"></i> Achat crédits
                </Link>
                <Link
                  href="/rapports"
                  className="menu-item"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <i className="fa-solid fa-chart-bar"></i> Rapports
                </Link>
                <button
                  className="menu-item logout-btn"
                  onClick={handleLogout}
                  style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="content-area">{children}</section>
      </main>

      <nav className="mobile-tab-bar">
        {mobileMenuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`tab-item ${pathname === item.path ? "active" : ""}`}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav> 
      
    </div>
  );
}