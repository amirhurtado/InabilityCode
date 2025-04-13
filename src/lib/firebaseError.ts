export const getFirebaseErrorMessage = (error : any) => {
    if (!error || !error.message) return "Error desconocido";
    const message = error.message.replace("Firebase: ", "");
    return  message;
  };