"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";

// Configuration de la clé JWT
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Configuration de Nodemailer (Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Envoi de l'email avec le code OTP
 */
async function sendOTPEmail(to: string, otp: string) {
  const mailOptions = {
    from: `"PichFlow" <${process.env.GMAIL_USER}>`,
    to: to,
    subject: "Code de confirmation - PichFlow",
    html: `
      <div style="font-family: sans-serif; text-align: center; padding: 40px; background-color: #f9f9f9;">
        <div style="max-width: 400px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
          <h1 style="color: #333;">Bienvenue sur PichFlow</h1>
          <p style="color: #666;">Merci de nous avoir rejoint ! Voici votre code de confirmation :</p>
          <div style="font-size: 32px; font-weight: bold; background: #eee; padding: 15px; border-radius: 5px; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #999;">Si vous n'avez pas créé de compte, ignorez simplement cet email.</p>
        </div>
      </div>
    `,
  };
  return await transporter.sendMail(mailOptions);
}

/**
 * Crée un cookie de session sécurisé
 */
async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();

  cookieStore.set("pichflow_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

/**
 * ACTION : INSCRIPTION AVEC GÉNÉRATION OTP
 */
export async function signUpAction(userData: any) {
  const { email, password, name } = userData;
  // Génération d'un code à 6 chiffres
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    const existingUser = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    if (existingUser.rows.length > 0) {
      return { error: "Cet email est déjà utilisé." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insertion avec is_verified = 0 et le code OTP
    await db.execute({
      sql: "INSERT INTO users (id, email, password_hash, credits, name, is_verified, otp_code) VALUES (?, ?, ?, ?, ?, 0, ?)",
      args: [userId, email, hashedPassword, 15, name, otp],
    });

    await db.execute({
      sql: "INSERT INTO sender_info (id, user_id, nom_service) VALUES (?, ?, ?)",
      args: [uuidv4(), userId, name]
    });

    // Envoi de l'email
    await sendOTPEmail(email, otp);

    // On connecte l'utilisateur (mais il sera bloqué par le layout tant qu'il n'aura pas validé)
    await createSession(userId);

    return { success: true };
  } catch (e) {
    console.error("Erreur Inscription:", e);
    return { error: "Une erreur est survenue lors de la création du compte." };
  }
}

/**
 * ACTION : VÉRIFIER LE CODE OTP SAISI PAR L'UTILISATEUR
 */
export async function verifyOTPAction(submittedOtp: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pichflow_token")?.value;
    if (!token) return { error: "Session expirée." };

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const res = await db.execute({
      sql: "SELECT otp_code FROM users WHERE id = ?",
      args: [userId]
    });

    if (res.rows[0]?.otp_code === submittedOtp) {
      // On valide l'utilisateur et on vide le code OTP
      await db.execute({
        sql: "UPDATE users SET is_verified = 1, otp_code = NULL WHERE id = ?",
        args: [userId]
      });
      return { success: true };
    } else {
      return { error: "Code de confirmation incorrect." };
    }
  } catch (e) {
    console.error(e);
    return { error: "Erreur lors de la vérification." };
  }
}

/**
 * ACTION : VÉRIFIER SI L'UTILISATEUR EST DÉJÀ VALIDÉ (Pour le Layout)
 */
export async function checkEmailVerification() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("pichflow_token")?.value;
    if (!token) return false;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = payload.userId as string;

    const result = await db.execute({
      sql: "SELECT is_verified FROM users WHERE id = ?",
      args: [userId],
    });

    // On s'assure que is_verified vaut bien 1
    return result.rows[0]?.is_verified === 1;
  } catch (error) {
    return false;
  }
}

/**
 * ACTION : CONNEXION CLASSIQUE
 */
export async function loginAction(credentials: any) {
  const { email, password } = credentials;

  try {
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    const user = result.rows[0];
    if (!user) {
      return { error: "Identifiants incorrects." };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password_hash as string
    );

    if (!isPasswordValid) {
      return { error: "Identifiants incorrects." };
    }

    await createSession(user.id as string);

    return { success: true, isVerified: user.is_verified === 1 };
  } catch (e) {
    console.error("Erreur Connexion:", e);
    return { error: "Une erreur est survenue lors de la connexion." };
  }
}

/**
 * ACTION : CONNEXION VIA GOOGLE
 */
export async function googleLoginAction(googleAccessToken: string) {
  try {
    const googleRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${googleAccessToken}` },
    });
    
    const googleData = await googleRes.json();
    
    if (!googleData.email) {
      return { error: "Impossible de récupérer l'email Google." };
    }

    const email = googleData.email;
    const name = googleData.name || "Utilisateur Google";

    const result = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    let userId;

    if (result.rows.length === 0) {
      userId = uuidv4();
      // Pour Google, on peut considérer l'email comme déjà vérifié (is_verified = 1)
      await db.execute({
        sql: "INSERT INTO users (id, email, password_hash, credits, name, is_verified) VALUES (?, ?, ?, ?, ?, 1)",
        args: [userId, email, "google-auth-no-password", 15, name],
      });
      await db.execute({
          sql: "INSERT INTO sender_info (id, user_id, nom_service) VALUES (?, ?, ?)",
          args: [uuidv4(), userId, name]
      });
    } else {
      userId = result.rows[0].id as string;
    }

    await createSession(userId);

    return { success: true };
  } catch (e) {
    console.error("Erreur Google Login:", e);
    return { error: "Erreur lors de la communication avec Google." };
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

    const { payload } = await jwtVerify(token, JWT_SECRET);
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