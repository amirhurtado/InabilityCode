import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

interface ValidationResponse {
  success: boolean;
  errors?: string[];
}

export async function POST(req: NextRequest): Promise<NextResponse<ValidationResponse>> {
  try {
    const formData = await req.formData();
    const type = formData.get('type')?.toString();
    const file = formData.get('disabilityPDF') as File;

    const furips = formData.get('furipsPDF') as File | null;
    const birthCert = formData.get('birthCertPDF') as File | null;
    const liveBirth = formData.get('liveBirthCertPDF') as File | null;
    const motherId = formData.get('motherIdPDF') as File | null;

    const errors: string[] = [];

    if (!type) {
      errors.push("Tipo de incapacidad no especificado.");
    }
    if (!file) {
      errors.push("El archivo principal de incapacidad es obligatorio.");
    }
    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Leer texto del PDF principal
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await pdfParse(buffer);
    const text = result.text;

    // Validaciones comunes
    if (!/diagn[oó]stico/i.test(text)) {
      errors.push("El PDF no contiene un diagnóstico válido.");
    }
    if (!/(\bd[ií]as\b|duraci[oó]n)/i.test(text)) {
      errors.push("El PDF no menciona los días de incapacidad.");
    }
    if (!/(nombre|paciente|identificaci[oó]n)/i.test(text)) {
      errors.push("Falta nombre o identificación del paciente.");
    }

    // Validaciones por tipo
    switch (type) {
      case "Licencia de maternidad":
        if (!/gestaci[oó]n|parto/i.test(text)) {
          errors.push("Debe indicar semanas de gestación o fecha de parto.");
        }
        break;
      case "Accidente de tránsito":
        if (!furips) {
          errors.push("Debe adjuntar el documento FURIPS.");
        }
        break;
      case "Licencia de paternidad":
        if (!birthCert || !liveBirth || !motherId) {
          errors.push("Debe adjuntar el registro civil, certificado de nacido vivo y cédula de la madre.");
        }
        break;
    }

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error validando PDF:", err);
    return NextResponse.json(
      { success: false, errors: ["El PDF no contiene la informacion requerida."] },
      { status: 500 }
    );
  }
}
