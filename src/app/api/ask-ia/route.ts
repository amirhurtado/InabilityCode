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

  try {
    console.log("ENTROOO 2")
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ASSISTIA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    const json = await response.json();
    const answer = json.choices?.[0]?.message?.content;

    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({ error: "Error al consultar la IA" }, { status: 500 });
  }
}
