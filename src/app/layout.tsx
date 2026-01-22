"use client";

import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboard =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/parametres") ||
    pathname?.startsWith("/factures") ||
    pathname?.startsWith("/rapports") ||
    pathname?.startsWith("/contenu-ia") ||
    pathname?.startsWith("/buy-credits") ||
    pathname?.startsWith("/change-password") ||
    pathname?.startsWith("/copywriting");

  return (
    <html lang="fr">
      <head>
        <title>Pichflow</title>

        <link rel="icon" href="/logo.png" type="image/png" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>

      <body>
        {!isDashboard && <Navbar />}
        <main>{children}</main>
        {!isDashboard && <Footer />}
      </body>
    </html>
  );
}
