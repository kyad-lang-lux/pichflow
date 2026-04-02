"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// On prépare la clé pour signer les sessions
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

/**
 * Crée un cookie de session sécurisé
 */
async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h") // Session de 24 heures
    .sign(JWT_SECRET);

  const cookieStore = await cookies();

  cookieStore.set("pichflow_token", token, {
    httpOnly: true, // Sécurité contre le vol de cookies par script
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

/**
 * ACTION : INSCRIPTION CLASSIQUE
 */
export async function signUpAction(userData: any) {
  const { email, password, name } = userData;

  try {
    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    if (existingUser.rows.length > 0) {
      return { error: "Cet email est déjà utilisé." };
    }

    // 2. Crypter le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    /**
     * 3. Création dans Turso
     * On insère désormais le 'name' dans la nouvelle colonne de la table users
     */
    await db.execute({
      sql: "INSERT INTO users (id, email, password_hash, credits, name) VALUES (?, ?, ?, ?, ?)",
      args: [userId, email, hashedPassword, 250, name],
    });

    /**
     * 4. Initialisation des infos émetteur
     * On utilise 'name' comme nom de service par défaut
     */
    await db.execute({
        sql: "INSERT INTO sender_info (id, user_id, nom_service) VALUES (?, ?, ?)",
        args: [uuidv4(), userId, name]
    });

    // 5. Connecter automatiquement l'utilisateur
    await createSession(userId);

    return { success: true };
  } catch (e) {
    console.error("Erreur Inscription:", e);
    return { error: "Une erreur est survenue lors de la création du compte." };
  }
}

/**
 * ACTION : CONNEXION CLASSIQUE
 */
export async function loginAction(credentials: any) {
  const { email, password } = credentials;

  try {
    // 1. Chercher l'utilisateur
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    const user = result.rows[0];
    if (!user) {
      return { error: "Identifiants incorrects." };
    }

    // 2. Comparer le mot de passe envoyé avec celui crypté en base
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash as string
    );

    if (!isPasswordValid) {
      return { error: "Identifiants incorrects." };
    }

    // 3. Créer la session
    await createSession(user.id as string);

    return { success: true };
  } catch (e) {
    console.error("Erreur Connexion:", e);
    return { error: "Une erreur est survenue lors de la connexion." };
  }
}

/**
 * Récupérer les crédits de l'utilisateur actuel
 */
export async function getUserCredits() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pichflow_token")?.value;
    if (!token) return 0;

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    const result = await db.execute({
      sql: "SELECT credits FROM users WHERE id = ?",
      args: [userId],
    });

    return Number(result.rows[0]?.credits) || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Déconnexion
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("pichflow_token");
}