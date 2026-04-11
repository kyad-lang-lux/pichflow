"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

/**
 * Récupère l'ID de l'utilisateur via le JWT
 */
async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pichflow_token")?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.userId as string;
  } catch (error) {
    return null;
  }
}

/**
 * Récupère les clients pour le formulaire
 */
export async function getClientsAction() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return [];
    const res = await db.execute({
      sql: "SELECT nom, contact, adresse FROM clients WHERE user_id = ? ORDER BY nom ASC",
      args: [userId]
    });
    return res.rows;
  } catch (e) {
    return [];
  }
}

/**
 * CRÉATION : Applique la TVA de sender_info à la facture
 */
export async function createFactureAction(formData: any) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return { success: false, error: "Non connecté" };

    // 1. Vérification des crédits
    const userRes = await db.execute({
      sql: "SELECT credits FROM users WHERE id = ?",
      args: [userId],
    });
    const currentCredits = Number(userRes.rows[0]?.credits || 0);
    if (currentCredits < 5) return { success: false, error: "Crédits insuffisants (5 requis)" };

    // 2. RÉCUPÉRATION DES INFOS SENDER (Inclus ifu_siret et autre_num)
    const senderRes = await db.execute({
      sql: "SELECT nom_service, adresse, contact, tva_rate, ifu_siret, autre_num FROM sender_info WHERE user_id = ?",
      args: [userId],
    });
    
    const sender = senderRes.rows[0];
    const tvaAAppliquer = Number(sender?.tva_rate || 0);

    const factureUuid = "fact_" + Date.now().toString();
    const numeroFacture = `F#${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;

    const queries: any[] = [
      // Déduction crédits
      { sql: "UPDATE users SET credits = credits - 5 WHERE id = ?", args: [userId] },
      // Insertion facture avec ifu_siret et autre_num
      {
        sql: `INSERT INTO factures (
          id, user_id, numero_facture, sender_nom, sender_adresse, sender_contact, 
          ifu_siret, autre_num, client_nom, client_contact, client_adresse, 
          devise, date_emission, date_echeance, tva_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          factureUuid, 
          userId, 
          numeroFacture, 
          sender?.nom_service || "PichFlow Service", 
          sender?.adresse || "", 
          sender?.contact || "",
          sender?.ifu_siret || "", 
          sender?.autre_num || "",
          formData.client, 
          formData.clientContact, 
          formData.clientAdresse,
          formData.devise, 
          new Date().toLocaleDateString('fr-FR'), 
          formData.echeance,
          tvaAAppliquer
        ]
      }
    ];

    // 3. Lignes de prestations
    formData.prestations.forEach((p: any) => {
      queries.push({
        sql: `INSERT INTO lignes_prestations (id, parent_id, parent_type, description, prix_unitaire, quantite) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [Math.random().toString(36).substr(2, 9), factureUuid, 'facture', p.description, p.prixUnitaire, p.quantite]
      });
    });

    await db.batch(queries, "write");
    revalidatePath("/factures");
    return { success: true };

  } catch (error) {
    console.error("Erreur creation facture:", error);
    return { success: false, error: "Erreur serveur" };
  }
}

/**
 * LISTE : Renvoie les factures avec leur TVA enregistrée
 */
export async function getFacturesAction() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return [];

    const res = await db.execute({
      sql: "SELECT * FROM factures WHERE user_id = ? ORDER BY id DESC",
      args: [userId]
    });

    return await Promise.all(res.rows.map(async (f: any) => {
      const lines = await db.execute({
        sql: "SELECT description, prix_unitaire, quantite FROM lignes_prestations WHERE parent_id = ? AND parent_type = 'facture'",
        args: [f.id]
      });

      return {
        dbId: String(f.id),
        id: String(f.numero_facture),
        client: String(f.client_nom),
        clientContact: String(f.client_contact),
        clientAdresse: String(f.client_adresse),
        senderNom: String(f.sender_nom || "PichFlow Service"),
        senderAdresse: String(f.sender_adresse || ""),
        senderContact: String(f.sender_contact || ""),
        senderIfu: String(f.ifu_siret || ""), // Ajouté pour le PDF
        senderAutre: String(f.autre_num || ""), // Ajouté pour le PDF
        tvaRate: Number(f.tva_rate || 0),
        prestations: lines.rows.map((l: any) => ({
          description: String(l.description),
          prixUnitaire: Number(l.prix_unitaire),
          quantite: Number(l.quantite)
        })),
        devise: String(f.devise),
        date: String(f.date_emission),
        echeance: String(f.date_echeance)
      };
    }));
  } catch (e) {
    return [];
  }
}

/**
 * SUPPRESSION
 */
export async function deleteFactureAction(dbId: string) {
  try {
    await db.batch([
      { sql: "DELETE FROM lignes_prestations WHERE parent_id = ? AND parent_type = 'facture'", args: [dbId] },
      { sql: "DELETE FROM factures WHERE id = ?", args: [dbId] }
    ], "write");
    revalidatePath("/factures");
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}