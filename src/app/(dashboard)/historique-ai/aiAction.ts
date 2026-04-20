"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

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

export async function getFullAIHistoryAction() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return [];

    const sql = `
      SELECT id, type, subject, content, created_at, 'marketing' as category 
      FROM marketing_history 
      WHERE user_id = ?
      UNION ALL
      SELECT id, type, subject, content, created_at, 'copywriting' as category 
      FROM copywriting_history 
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const res = await db.execute({
      sql,
      args: [userId, userId]
    });

    return res.rows.map((row: any) => ({
      id: String(row.id),
      type: String(row.type),
      subject: String(row.subject),
      content: String(row.content),
      category: String(row.category),
      date: Number(row.created_at)
    }));
  } catch (e) {
    console.error("Erreur historique:", e);
    return [];
  }
}

// --- ACTIONS FACEBOOK CORRIGÉES ---

export async function getFacebookLoginUrlAction() {
  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;
  
  // CORRECTION : On ajoute 'email' et on s'assure que l'ordre est propre.
  // Note : Assure-toi d'avoir cliqué sur "Obtenir l'accès avancé" pour ces permissions dans ton dashboard Meta.
  const scopes = [
    "public_profile", 
    "email", 
    "pages_manage_posts", 
    "pages_read_engagement", 
    "pages_show_list"
  ].join(",");

  return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=code`;
}

export async function checkFacebookLinkedAction() {
  const userId = await getAuthUserId();
  if (!userId) return false;

  const res = await db.execute({
    sql: "SELECT id FROM facebook_accounts WHERE user_id = ?",
    args: [userId]
  });

  return res.rows.length > 0;
}

export async function publishToFacebookAction(content: string) {
  try {
    const userId = await getAuthUserId();
    if (!userId) throw new Error("Veuillez vous reconnecter.");

    const res = await db.execute({
      sql: "SELECT access_token, page_id FROM facebook_accounts WHERE user_id = ?",
      args: [userId]
    });

    if (res.rows.length === 0) throw new Error("Compte Facebook non lié.");
    
    // Correction du typage pour éviter les erreurs TS
    const account = res.rows[0] as unknown as { access_token: string; page_id: string };
    const { access_token, page_id } = account;

    if (!page_id) throw new Error("Aucune page Facebook trouvée. Veuillez relier votre compte.");

    // Publication via l'API Graph
    const fbRes = await fetch(`https://graph.facebook.com/v19.0/${page_id}/feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: content,
        access_token: access_token
      })
    });

    const data = await fbRes.json();
    
    if (data.error) {
      console.error("Détails erreur FB:", data.error);
      throw new Error(data.error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erreur publication:", error.message);
    return { success: false, error: error.message };
  }
}