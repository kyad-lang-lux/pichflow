"use server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { revalidatePath } from "next/cache";

async function getAuthUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pichflow_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ""));
    return payload.userId as string;
  } catch (error) { return null; }
}

export async function getClientsAction() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return [];
    const res = await db.execute({
      sql: "SELECT nom, contact, adresse FROM clients WHERE user_id = ? ORDER BY nom ASC",
      args: [userId]
    });
    return res.rows;
  } catch (e) { return []; }
}

export async function createDevisAction(formData: any) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return { success: false, error: "Non connecté" };

    const userRes = await db.execute({
      sql: "SELECT credits FROM users WHERE id = ?",
      args: [userId],
    });
    const currentCredits = Number(userRes.rows[0]?.credits || 0);
    if (currentCredits < 5) return { success: false, error: "Crédits insuffisants (5 requis)" };

    // RÉCUPÉRATION DE LA TVA DEPUIS SENDER_INFO
    const senderRes = await db.execute({
      sql: "SELECT nom_service, adresse, contact, tva_rate FROM sender_info WHERE user_id = ?",
      args: [userId],
    });
    const sender = senderRes.rows[0];
    const senderNom = sender?.nom_service || "PichFlow Service";
    const senderAdresse = sender?.adresse || "";
    const senderContact = sender?.contact || "";
    const tvaRate = Number(sender?.tva_rate || 0); // Application de la TVA comme pour les factures

    const devisUuid = "dev_" + Date.now().toString();
    const numeroDevis = `D-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const queries: any[] = [
      { sql: "UPDATE users SET credits = credits - 5 WHERE id = ?", args: [userId] },
      {
        sql: `INSERT INTO devis (
          id, user_id, numero_devis, sender_nom, sender_adresse, sender_contact, 
          client_nom, client_contact, client_adresse, devise, date_emission, date_echeance, tva_rate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          devisUuid, userId, numeroDevis, senderNom, senderAdresse, senderContact,
          formData.client, formData.clientContact, formData.clientAdresse,
          formData.devise, new Date().toLocaleDateString('fr-FR'), formData.echeance, tvaRate
        ]
      }
    ];

    formData.prestations.forEach((p: any) => {
      queries.push({
        sql: `INSERT INTO lignes_prestations (id, parent_id, parent_type, description, prix_unitaire, quantite) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [Math.random().toString(36).substr(2, 9), devisUuid, 'devis', p.description, p.prixUnitaire, p.quantite]
      });
    });

    await db.batch(queries, "write");
    revalidatePath("/devis");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erreur serveur" };
  }
}

export async function getDevisAction() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return [];

    const res = await db.execute({
      sql: "SELECT * FROM devis WHERE user_id = ? ORDER BY id DESC",
      args: [userId]
    });

    return await Promise.all(res.rows.map(async (d: any) => {
      const lines = await db.execute({
        sql: "SELECT description, prix_unitaire, quantite FROM lignes_prestations WHERE parent_id = ? AND parent_type = 'devis'",
        args: [d.id]
      });

      return {
        dbId: String(d.id),
        id: String(d.numero_devis),
        client: String(d.client_nom),
        clientContact: String(d.client_contact),
        clientAdresse: String(d.client_adresse),
        senderNom: d.sender_nom ? String(d.sender_nom) : "PichFlow Service",
        senderAdresse: d.sender_adresse ? String(d.sender_adresse) : "",
        senderContact: d.sender_contact ? String(d.sender_contact) : "",
        tvaRate: Number(d.tva_rate || 0),
        prestations: lines.rows.map((l: any) => ({
          description: String(l.description),
          prixUnitaire: Number(l.prix_unitaire),
          quantite: Number(l.quantite)
        })),
        devise: String(d.devise),
        date: String(d.date_emission),
        echeance: String(d.date_echeance)
      };
    }));
  } catch (e) { return []; }
}

export async function deleteDevisAction(dbId: string) {
  try {
    await db.batch([
      { sql: "DELETE FROM lignes_prestations WHERE parent_id = ? AND parent_type = 'devis'", args: [dbId] },
      { sql: "DELETE FROM devis WHERE id = ?", args: [dbId] }
    ], "write");
    revalidatePath("/devis");
    return { success: true };
  } catch (e) { return { success: false }; }
}