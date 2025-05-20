"use server";

import { adminDb } from "../../../../lib/firebaseAdmin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // ✅ Crea la instancia UNA VEZ arriba

export async function updateDisabilityStatus(
  id: string,
  status: string,
  motivo?: string
) {
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


  if ((newStatus === "rechazada" || newStatus === "transcrita") && toEmail) {
    try {
      const isRechazada = newStatus === "rechazada";

      console.log("ENTRO ACAA")
  
      const subject = isRechazada
        ? "Motivo de rechazo de tu incapacidad"
        : "Tu solicitud ha sido transcrita";
  
      const html = isRechazada
        ? `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
            <h2 style="color: #c0392b;">Incapacidad Rechazada</h2>
            <p>Hola,</p>
            <p>Tu solicitud de incapacidad ha sido <strong>rechazada</strong> por la siguiente razón:</p>
            <div style="background-color: #f8d7da; padding: 12px 16px; border-left: 4px solid #c0392b; margin: 16px 0;">
              <em>${motivo}</em>
            </div>
            <p>Si consideras que se trata de un error o necesitas más información, por favor comunícate con tu líder o área de talento humano.</p>
            <p style="margin-top: 32px;">Atentamente,<br>Inability Code</p>
          </div>
        `
        : `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
            <h2 style="color: #2e86de;">Incapacidad Transcrita</h2>
            <p>Hola,</p>
            <p>Tu solicitud de incapacidad ha sido <strong>transcrita</strong> correctamente.</p>
            <p>Te avisaremos cuando se termine el proceso.</p>
            <p style="margin-top: 32px;">Atentamente,<br>Inability Code</p>
          </div>
        `;
  
      const response = await resend.emails.send({
        from: "Inability Code <onboarding@resend.dev>",
        to: ['a.hurtado@utp.edu.co'], 
        subject,
        html,
      });
  
      console.log("✅ Correo enviado con Resend:", response);
    } catch (error) {
      console.error("❌ Error al enviar correo con Resend:", error);
    }
  }
  
}
