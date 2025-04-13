import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../../../lib/firebase";
import { setAuthCookie } from "@/app/services/auth/actions";
import { doc, setDoc } from "firebase/firestore";

export const onSubmitRegister = async (data: logsProps) => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
  
    await setDoc(doc(db, "users", userCred.user.uid), {
        username: data.username,
        email: data.email,
        createdAt: new Date().toISOString(),
    })
    
    const token = await userCred.user.getIdToken();
    await setAuthCookie(token);

  
  } catch (e) {
    console.log(e);
  }
};

export const onSubmitLogIn = async (data: logsProps) => {
    console.log("LOGIN", data);
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const token = await userCred.user.getIdToken();
      await setAuthCookie(token);
    } catch (e) {
      console.log(e);
    }
  };
  