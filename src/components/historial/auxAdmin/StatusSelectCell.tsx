"use client";

import { useState } from "react";
import { updateDisabilityStatus } from "@/app/services/disability/actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/AlertDialog";
import { Textarea } from "@/components/Textarea";


type Props = {
  id: string;
  email: string | undefined;
  currentStatus: string;
  onStatusChange: (newStatus: string) => void;
};

const allowedTransitions: Record<string, string[]> = {
  pendiente: ["transcrita", "rechazada"],
  transcrita: ["pagada", "rechazada"],
  pagada: [],
  rechazada: [],
};

const getColorForStatus = (status: string) => {
  const base = "px-2 py-1 rounded text-sm";
  switch (status) {
    case "pending":
      return `${base} bg-white text-slate-800 border`;
    case "transcrita":
      return `${base} bg-blue-100 text-blue-700 border border-blue-300`;
    case "rechazada":
      return `${base} bg-red-100 text-red-700 border border-red-300`;
    case "pagada":
      return `${base} bg-green-100 text-green-700 border border-green-300`;
    default:
      return `${base} bg-gray-100 text-gray-700 border border-gray-300`;
  }
};

export const StatusSelectCell = ({ id, email, currentStatus, onStatusChange }: Props) => {
  const [localStatus, setLocalStatus] = useState(currentStatus);
  const [nextStatus, setNextStatus] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    if (newStatus === "rechazada") {
      setNextStatus(newStatus);
      setShowDialog(true);
    } else {
      await processStatusChange(newStatus);
    }
  };

  const processStatusChange = async (newStatus: string, motivo?: string) => {
    setLoading(true);
  
    if (newStatus === "rechazada" || newStatus === "transcrita" && email) {
      await fetch("/api/disability/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newStatus, motivo, toEmail: email }),
      });
    } else {
      await updateDisabilityStatus(id, newStatus);
    }
  
    setLocalStatus(newStatus);
    onStatusChange(newStatus);
    setLoading(false);
  };

  const options = allowedTransitions[localStatus] ?? [];

  return (
    <>
      <select
        className={getColorForStatus(localStatus)}
        value={localStatus}
        onChange={handleChange}
        disabled={loading || options.length === 0}
      >
        <option value={localStatus} disabled>
          {localStatus.charAt(0).toUpperCase() + localStatus.slice(1)}
        </option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </option>
        ))}
      </select>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="!bg-background">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400">Rechazada por:</AlertDialogTitle>
            <AlertDialogDescription>
              <Textarea
                placeholder="Escribe el motivo del rechazo"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="!bg-red-400 !text-white" onClick={() => setReason("") }>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="!text-white"
              onClick={async () => {
                if (nextStatus) {
                  await processStatusChange(nextStatus, reason.trim());
                  
                  setReason("");
                  setShowDialog(false);
                }
              }}
            >
              Enviar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
