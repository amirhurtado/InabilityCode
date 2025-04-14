// app/api/disability/validate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function uploadToCloudinary(file: File, name: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "incapacidades",
        resource_type: "auto",
        public_id: `${name}_${Date.now()}`,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });

  return result.secure_url;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const files = {
      disabilityPDF: formData.get("disabilityPDF") as File | null,
      furipsPDF: formData.get("furipsPDF") as File | null,
      medicalCertPDF: formData.get("medicalCertPDF") as File | null,
      birthCertPDF: formData.get("birthCertPDF") as File | null,
      liveBirthCertPDF: formData.get("liveBirthCertPDF") as File | null,
      motherIdPDF: formData.get("motherIdPDF") as File | null,
    };

    const uploadedUrls: Record<string, string> = {};

    for (const [key, file] of Object.entries(files)) {
      if (file) {
        const url = await uploadToCloudinary(file, key);
        uploadedUrls[key] = url;
      }
    }

    return NextResponse.json({
      success: true,
      ...uploadedUrls,
    });
  } catch (error) {
    console.error("❌ Error subiendo archivos a Cloudinary:", error);
    return NextResponse.json({ success: false, errors: ["Error subiendo archivos."] }, { status: 500 });
  }
}
