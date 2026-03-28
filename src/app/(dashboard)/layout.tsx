"use client";

import "@/app/dashboard.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [credits, setCredits] = useState(250);

  useEffect(() => {
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

  // Sidebar : Division classique
  const sidebarPrimaryItems = allMenuItems.slice(0, 5);
  const sidebarSecondaryItems = allMenuItems.slice(5);

  // Mobile : On filtre pour exclure "Rapports" et "Paramètres"
  const mobileMenuItems = allMenuItems.filter(
    (item) => item.name !== "Rapports " && item.name !== "Paramètres "
  );

  const activeItem = allMenuItems.find((item) => item.path === pathname);
  const activeTitle = activeItem ? activeItem.name : "Dashboard";

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
                gap: "12px",
                padding: "3px 7px",
                borderRadius: "20px",
                background: "rgba(0,0,0,0.03)",
                border: "2px solid rgba(0,0,0,0.5)",
              }}
            >
              <div
                className="credits-badge"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "0.68rem",
                  fontWeight: "900",
                  color: "#fff",
                  padding: "2px 6px",
                  background: "#000",
                  borderRadius: "12px",
                }}
              >
                <i className="fa-solid fa-coins"></i>
                <span>{credits}</span>
              </div>

              <span style={{ color: "#000", fontSize: "18px" }} className="user-badge">
                <i className="fa-solid fa-user"></i>
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
                  onClick={() => (window.location.href = "/")}
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="content-area">{children}</section>
      </main>

      {/* Barre de navigation mobile mise à jour */}
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