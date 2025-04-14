// app/api/disability/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("disabilityPDF") as File;

    if (!file) {
      return NextResponse.json({ success: false, errors: ["Debe subir un archivo PDF."] }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "incapacidades",
          resource_type: "auto", 
          public_id: `disability_${Date.now()}`, 
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      ).end(buffer);
      
    });

    return NextResponse.json({
      success: true,
      pdfUrl: uploadResult.secure_url,
    });
  } catch (error) {
    console.error("❌ Error subiendo a Cloudinary:", error);
    return NextResponse.json({ success: false, errors: ["Error subiendo archivo."] }, { status: 500 });
  }
}
