import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


export const getLabelFromKey = (key: string): string => {
  const labels: Record<string, string> = {
    disabilityPDF: "Certificado de incapacidad",
    furipsPDF: "FURIPS",
    medicalCertPDF: "Certificado médico tratante",
    birthCertPDF: "Registro civil de nacimiento",
    liveBirthCertPDF: "Certificado de nacido vivo",
    motherIdPDF: "Cédula de la madre",
  };
  return labels[key] || key;
};

