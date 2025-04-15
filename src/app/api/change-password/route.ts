import { changePassword } from "@/app/services/auth/actions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { newPassword } = await request.json();
    console.log("[API] Cambiar contraseña recibido:", newPassword);

    await changePassword(newPassword);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[API] Error al cambiar contraseña:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
