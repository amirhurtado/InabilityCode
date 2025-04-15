"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";

type Props = {
  open: boolean;
  onClose: () => void;
  userEmail: string;
  startDate: string;
  endDate: string;
  disabilityId: string;
  onAssigned: (disabilityId: string) => void;
};

interface User {
  id: string;
  email: string;
  nombre: string;
  role: string;
}

export default function AssignReplacementDialog({
  open,
  onClose,
  userEmail,
  startDate,
  endDate,
  disabilityId,
  onAssigned,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersWithoutDisability = async () => {
      const db = getFirestore();
      const allUsersSnapshot = await getDocs(collection(db, "users"));

      const disabilitiesSnapshot = await getDocs(
        query(
          collection(db, "incapacidades"),
          where("status", "in", ["pending", "transcrita"])
        )
      );
      const userIdsWithDisabilities = new Set(
        disabilitiesSnapshot.docs.map((doc) => doc.data().userId)
      );

      const availableUsers = allUsersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as User))
        .filter(
          (user) => user.role === "colaborador" && !userIdsWithDisabilities.has(user.id)
        );

      setUsers(availableUsers);
      setLoading(false);
    };

    if (open) fetchUsersWithoutDisability();
  }, [open]);

  const handleAssign = async (replacementEmail: string) => {
    const db = getFirestore();
    try {
      await addDoc(collection(db, "reemplazos"), {
        ReplacedEmail: userEmail,
        replacementEmail,
        startDate,
        endDate,
        timestamp: new Date().toISOString(),
        disabilityId,
      });
      onAssigned(disabilityId);
      console.log("Reemplazo guardado");
      onClose();
    } catch (err) {
      console.error("Error al guardar el reemplazo:", err);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Asignar reemplazo</AlertDialogTitle>
          <AlertDialogDescription>
            Selecciona un colaborador disponible:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="max-h-[200px] overflow-y-auto mt-4 space-y-2">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : users.length ? (
            users.map((user) => (
              <Button
                key={user.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleAssign(user.email)}
              >
                {user.email}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No hay disponibles.</p>
          )}
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
