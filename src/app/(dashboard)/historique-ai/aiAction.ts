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

    // UNION pour récupérer les deux tables en une seule fois
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
      category: String(row.category), // 'marketing' ou 'copywriting'
      date: Number(row.created_at)
    }));
  } catch (e) {
    console.error("Erreur historique:", e);
    return [];
  }
}