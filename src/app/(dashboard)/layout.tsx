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
    { name: "Marketing ", path: "/contenu-ia", icon: "fa-wand-magic-sparkles" },
    { name: "Copywriting ", path: "/copywriting", icon: "fa-pen-nib" },
    { name: "Factures ", path: "/factures", icon: "fa-file-invoice" },
    { name: "Rapports ", path: "/rapports", icon: "fa-chart-line" },
    { name: "Paramètres ", path: "/parametres", icon: "fa-gear" }
  ];

  const sidebarPrimaryItems = allMenuItems.slice(0, 5);
  const sidebarSecondaryItems = allMenuItems.slice(5);

  const activeItem = allMenuItems.find((item) => item.path === pathname);
  const activeTitle = activeItem ? activeItem.name : "Dashboard";

  return (
    <div className="dashboard-container">  
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/dashboard" className="logo">
            <div className="logo-icon"> 
              <i className="fa-solid fa-circle-nodes"></i>
            </div>
            <span className="logo-text">PichFlow</span>
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
            <h1><span>
              {activeTitle === "Paramètres"
                ? "Gérez votre compte"
                : "PichFlow"} &gt;  
            </span>
              
              {activeTitle}  
            
            </h1>
          </div>

          <div className="topbar-right" ref={profileRef}>
            <button className="user-btn" onClick={() => setIsProfileOpen(!isProfileOpen)}>  
              <span className="user-badge"><i className="fa-solid fa-user"></i></span>
            </button> 

            {isProfileOpen && (
              <div className="profile-dropdown">
                <Link href="/parametres" className="menu-item" onClick={() => setIsProfileOpen(false)}>
                  <i className="fa-solid fa-user-gear"></i> Paramètres
                </Link>
                <button className="menu-item logout-btn" onClick={() => window.location.href = '/'}>
                  <i className="fa-solid fa-right-from-bracket"></i> Déconnexion
                </button>
              </div>
            )}
          </div>
        </header>

        <section className="content-area">{children}</section>
      </main>

      <nav className="mobile-tab-bar">
        {sidebarPrimaryItems.slice(0, 4).map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`tab-item ${pathname === item.path ? "active" : ""}`}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span>{item.name}</span>
          </Link> 
        ))}
        <Link href="/parametres" className={`tab-item ${pathname === "/parametres" ? "active" : ""}`}>
          <i className="fa-solid fa-gear"></i>
          <span>Paramètres</span>
        </Link>
      </nav>
    </div>
  );
}