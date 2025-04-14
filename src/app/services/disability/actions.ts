
'use server';

import { adminDb } from "../../../../lib/firebaseAdmin";

export async function updateDisabilityStatus(id: string, status: string, motivo?: string) {
  const updateData: any = {
    status,
  };

  if (status === "rechazada" && motivo) {
    updateData.observacionRechazo = motivo;
  }

  await adminDb.collection("incapacidades").doc(id).update(updateData);
}
