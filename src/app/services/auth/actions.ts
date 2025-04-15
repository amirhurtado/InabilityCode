"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "../../../../lib/firebaseAdmin";

export const setAuthCookie = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24,
  });

  const user = await getUser();

  if (user?.role === "lider") {
    redirect("/dashboard-lider");
  } else if (user?.role === "auxAdmin") {
    redirect("/dashboard-auxAdmin");
  } else {
    redirect("/dashboard");
  }
};

export const getUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) return null;

  try {
    const decode = await adminAuth.verifyIdToken(token);
    const userId = decode.uid;

    const snap = await adminDb.collection("users").doc(userId).get();
    if (!snap.exists) return null;
    const userData = snap.data();
    if (!userData) return null;

    return userData;
  } catch {
    return null;
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/");
};


export const changePassword = async (newPassword: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (!token) throw new Error("No hay token");

  const decoded = await adminAuth.verifyIdToken(token);
  const uid = decoded.uid;

  if (!uid) throw new Error("No se pudo obtener el UID");

  await adminAuth.updateUser(uid, { password: newPassword });

  console.log("[changePassword] Contraseña actualizada exitosamente");
  return { success: true };
};