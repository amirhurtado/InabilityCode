import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../../lib/firebase";
import { setAuthCookie } from "@/app/services/auth/actions";

export const onSubmitRegister = async (data: logsProps) => {
  try {
    const userCred = await createUserWithEmailAndPassword(
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
      console.log(e);
    }
  };
  