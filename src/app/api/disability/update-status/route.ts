import { NextResponse } from "next/server";
import { updateStatusAndNotify } from "@/app/services/disability/actions";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, newStatus, motivo, toEmail } = body;

  await updateStatusAndNotify(id, newStatus, motivo, toEmail);

  return NextResponse.json({ ok: true });
}