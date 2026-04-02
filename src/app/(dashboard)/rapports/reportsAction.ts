"use server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pichflow_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    return payload.userId as string;
  } catch (error) { return null; }
}

export async function getReportData() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return null;

    // 1. CALCUL DU CHIFFRE D'AFFAIRES (Jointure entre factures et lignes_prestations)
    const revRes = await db.execute({
      sql: `
        SELECT 
          SUM(lp.prix_unitaire * lp.quantite) as total 
        FROM factures f
        JOIN lignes_prestations lp ON f.id = lp.parent_id
        WHERE f.user_id = ? AND lp.parent_type = 'facture'
      `,
      args: [userId],
    });

    // 2. ÉVOLUTION MENSUELLE DES REVENUS (Pour le graphique)
    // Note: On utilise SUBSTR car tes dates sont stockées en format texte fr-FR (JJ/MM/AAAA)
    const monthlyRes = await db.execute({
      sql: `
        SELECT 
          SUBSTR(f.date_emission, 4, 2) as month, 
          SUM(lp.prix_unitaire * lp.quantite) as total
        FROM factures f
        JOIN lignes_prestations lp ON f.id = lp.parent_id
        WHERE f.user_id = ? AND lp.parent_type = 'facture'
        GROUP BY month
      `,
      args: [userId],
    });

    // 3. COMPTAGE MARKETING
    const countMarketing = await db.execute({
      sql: "SELECT COUNT(*) as count FROM marketing_history WHERE user_id = ?",
      args: [userId],
    });

    // 4. COMPTAGE COPYWRITING
    const countCopy = await db.execute({
      sql: "SELECT COUNT(*) as count FROM copywriting_history WHERE user_id = ?",
      args: [userId],
    });

    return {
      totalRevenue: Number(revRes.rows[0]?.total || 0),
      monthlyRevenue: monthlyRes.rows,
      marketingCount: Number(countMarketing.rows[0]?.count || 0),
      copywritingCount: Number(countCopy.rows[0]?.count || 0),
    };
  } catch (error) {
    console.error("Erreur rapports:", error);
    return null;
  }
}