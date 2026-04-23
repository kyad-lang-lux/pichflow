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
      FROM marketing_history WHERE user_id = ?
      UNION ALL
      SELECT id, type, subject, content, created_at, 'copywriting' as category 
      FROM copywriting_history WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const res = await db.execute({ sql, args: [userId, userId] });

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

// --- GESTION COMPTE LINKEDIN ---

export async function checkLinkedInLinkedAction() {
  const userId = await getAuthUserId();
  if (!userId) return false;

  const res = await db.execute({
    sql: "SELECT id FROM social_accounts WHERE user_id = ? AND platform = 'linkedin'",
    args: [userId]
  });

  return res.rows.length > 0;
}

export async function getLinkedInLoginUrlAction() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
  const scopes = ["w_member_social", "openid", "profile", "email"].join(" ");
  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
}

export async function publishToLinkedInAction(content: string) {
  try {
    const userId = await getAuthUserId();
    const res = await db.execute({
      sql: "SELECT access_token, platform_id FROM social_accounts WHERE user_id = ? AND platform = 'linkedin'",
      args: [userId]
    });

    if (res.rows.length === 0) throw new Error("Compte LinkedIn non lié.");
    const { access_token, platform_id } = res.rows[0] as any;

    const liRes = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: `urn:li:person:${platform_id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: content },
            shareMediaCategory: "NONE",
          },
        },
        visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
      }),
    });

    const data = await liRes.json();
    if (data.error) throw new Error(data.message);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// --- PROGRAMMATION ---
export async function scheduleLinkedInPostAction(content: string, date: string, time: string) {
  try {
    const userId = await getAuthUserId();
    if (!userId) return { success: false };
    const scheduledAt = new Date(`${date}T${time}`).getTime();

    await db.execute({
      sql: "INSERT INTO scheduled_posts (user_id, content, scheduled_at) VALUES (?, ?, ?)",
      args: [userId, content, scheduledAt]
    });
    return { success: true };
  } catch (e) {
    return { success: false, error: "Erreur lors de la programmation." };
  }
}

// --- DÉCONNEXION ---
export async function disconnectLinkedInAction() {
  try {
    const userId = await getAuthUserId();
    if (!userId) return { success: false };
    await db.execute({
      sql: "DELETE FROM social_accounts WHERE user_id = ? AND platform = 'linkedin'",
      args: [userId]
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}