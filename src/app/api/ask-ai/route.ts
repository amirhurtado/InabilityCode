// src/app/api/ask-ai/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { question } = await req.json();

  const systemPrompt = `
Eres un asistente virtual especializado en incapacidades laborales dentro de una plataforma organizacional. Existen tres roles: colaborador, auxiliar administrativo y líder. 
- El colaborador puede registrar incapacidades, ver su historial, descargar PDFs, ver fechas y el estado de su proceso.
- El auxiliar verifica y cambia estados (pendiente, transcrita, rechazada, pagada), puede filtrar por correo y fechas.
- El líder asigna reemplazos a incapacitados.
- Hay distintos tipos de incapacidades con documentos requeridos según el caso (como FURIPS, nacido vivo, cédulas, etc.).
- El sistema permite cambiar contraseña, usar modo oscuro y ver detalles de cada solicitud.
Contesta cualquier duda sobre cómo funciona este sistema.
`;

  if (!process.env.ASSISTIA_API_KEY) {
    return NextResponse.json({ error: "API Key no definida" }, { status: 500 });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.ASSISTIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `### Instrucción:\n${systemPrompt}\n\n### Pregunta:\n${question}\n\n### Respuesta:\n`,
        }),
      }
    );

    const json = await response.json();
    console.log("🔎 HuggingFace Response:", JSON.stringify(json, null, 2));

    const answer = Array.isArray(json)
      ? json[0]?.generated_text?.split("### Respuesta:")?.[1]?.trim()
      : json?.generated_text;

    return NextResponse.json({ answer: answer || "No se pudo obtener respuesta." });
  } catch (err) {
    console.error("❌ Error al contactar con Hugging Face:", err);
    return NextResponse.json({ error: "Error al consultar la IA" }, { status: 500 });
  }
}
