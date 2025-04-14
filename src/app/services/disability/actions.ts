'use server';

import { adminDb } from "../../../../lib/firebaseAdmin";
import { Resend } from 'resend';


export async function updateDisabilityStatus(id: string, status: string, motivo?: string) {
  const updateData: any = { status };

  if (status === "rechazada" && motivo) {
    updateData.observacionRechazo = motivo;
  }

  await adminDb.collection("incapacidades").doc(id).update(updateData);
}

export async function updateStatusAndNotify(
  id: string,
  newStatus: string,
  motivo: string,
  toEmail: string
) {

  await updateDisabilityStatus(id, newStatus, motivo);
  console.log(newStatus, motivo, toEmail);
  if (newStatus === "rechazada" && motivo && toEmail) {
    console.log("AQUI ENTRO")
    const resend = new Resend(process.env.RESEND_API_KEY);

    resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'a.hurtado@utp.edu.co',
      subject: 'Motivo de rechazo de tu incapacidad',
      html: `<p>Hola,</p><p>Tu solicitud fue rechazada por la siguiente razón:</p><blockquote>${motivo}</blockquote>`

    });
    } 
}
  
