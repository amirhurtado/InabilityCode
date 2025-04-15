import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../../lib/firebase";
import { setAuthCookie } from "@/app/services/auth/actions";
import { doc, setDoc } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";
export const onSubmitRegister = async (data: logsProps) => {
  try {
    let assignedRole = "colaborador";

    if (data.invitationCode) {
      const llavesRef = collection(db, "llavesPrivadas");
      const snapshot = await getDocs(llavesRef);

      let found = false;

      for (const docSnap of snapshot.docs) {
        const llaveData = docSnap.data();

        for (const key in llaveData) {
          if (llaveData[key] === data.invitationCode) {
            assignedRole = key;
            found = true;
            break;
          }
        }

        if (found) break;
      }

      if (!found) {
        throw new Error("Clave de invitación inválida");
      }
    }

    const userCred = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    await setDoc(doc(db, "users", userCred.user.uid), {
      username: data.username,
      email: data.email,
      role: assignedRole,
      createdAt: new Date().toISOString(),
    });

    const token = await userCred.user.getIdToken();
    await setAuthCookie(token);
  } catch (e) {
    throw e; 
  }
};
export const onSubmitLogIn = async (data: logsProps) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const token = await userCred.user.getIdToken();
      await setAuthCookie(token);
    } catch (e) {
      throw e;
    }
  };
  

export const changePasswordClient = async (newPassword: string) => {
    const res = await fetch("/api/change-password", {
      method: "POST",
      body: JSON.stringify({ newPassword }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!res.ok) throw new Error("No se pudo cambiar la contraseña");
    return await res.json();
};