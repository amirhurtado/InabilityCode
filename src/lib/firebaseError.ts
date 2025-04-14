export const getFirebaseErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return "Error desconocido";
  }

  const message = (error as { message: string }).message;


  if (!message.includes("Firebase:") && !message.includes("Clave")) {
    return ""; 
  }

  return message.replace("Firebase: ", "").trim();
};
