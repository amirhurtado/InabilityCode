import { auth, db } from "../../../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function validateDisabilityServer(data: FormData): Promise<{ success: boolean; pdfUrl?: string; errors?: string[] }> {
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
  pdfUrl: string;
}

// 🔁 Esta es la nueva función
export async function saveDisabilityToFirestore(data: DisabilityFormData): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuario no autenticado");

  await addDoc(collection(db, "incapacidades"), {
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    observations: data.observations,
    pdfUrl: data.pdfUrl,
    userId: user.uid,
    createdAt: Timestamp.now(),
    status: "pending",
  });
}
