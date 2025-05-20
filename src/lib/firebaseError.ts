export const getFirebaseErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== "object" || !("message" in error)) {
    return "Error desconocido";
  }

  const message = (error as { message: string }).message;

  // Lista de traducciones
  const translations: Record<string, string> = {
    "auth/user-not-found": "Usuario no encontrado",
    "auth/wrong-password": "Contraseña incorrecta",
    "auth/email-already-in-use": "Este correo ya está en uso",
    "auth/invalid-email": "Correo electrónico inválido",
    "auth/weak-password": "La contraseña es demasiado débil",
    "auth/missing-password": "Por favor ingresa una contraseña",
    "auth/too-many-requests": "Demasiados intentos fallidos, intenta más tarde",
    "auth/invalid-login-credentials": "Credenciales inválidas",
  };

  // Detectar el código de error
  const codeMatch = message.match(/\(auth\/[^\)]+\)/);
  if (codeMatch) {
    const code = codeMatch[0].replace(/[()]/g, ""); // ejemplo: (auth/user-not-found) → auth/user-not-found
    return translations[code] || "Error de autenticación";
  }

  // Fallback: mensaje limpio
  return message.replace("Firebase: ", "").trim();
};
