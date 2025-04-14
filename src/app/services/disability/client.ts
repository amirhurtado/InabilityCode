import { auth, db } from "../../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export interface DisabilityValidationResult {
  success: boolean;
  pdfUrl: string; // puedes eliminar esto si decides usar solo disabilityPDF
  disabilityPDF?: string;
  furipsPDF?: string;
  medicalCertPDF?: string;
  birthCertPDF?: string;
  liveBirthCertPDF?: string;
  motherIdPDF?: string;
  errors?: string[];
}

export async function validateDisabilityServer(data: FormData): Promise<DisabilityValidationResult> {
  const res = await fetch("/api/disability/validate", {
    method: "POST",
    body: data,
  });

  return res.json();
}

export interface DisabilityFormData {
  type: string;
  startDate: string;
  endDate: string;
  observations: string;
  pdfUrl?: string;
  furipsUrl?: string;
  medicalCertUrl?: string;
  birthCertUrl?: string;
  liveBirthCertUrl?: string;
  motherIdUrl?: string;
}

export async function saveDisabilityToFirestore(data: DisabilityFormData): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  const files: Record<string, string> = {};

  if (data.pdfUrl) files.disabilityPDF = data.pdfUrl;
  if (data.furipsUrl) files.furipsPDF = data.furipsUrl;
  if (data.medicalCertUrl) files.medicalCertPDF = data.medicalCertUrl;
  if (data.birthCertUrl) files.birthCertPDF = data.birthCertUrl;
  if (data.liveBirthCertUrl) files.liveBirthCertPDF = data.liveBirthCertUrl;
  if (data.motherIdUrl) files.motherIdPDF = data.motherIdUrl;

  await addDoc(collection(db, "incapacidades"), {
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    observations: data.observations,
    files,
    userId: user.uid,
    createdAt: Timestamp.now(),
    status: "pending",
  });
}
