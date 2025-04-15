"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import AssignReplacementDialog from "./AssignReplacementDialog";

type Props = {
  userEmail: string; // Email del que está siendo reemplazado
  startDate: string;
  endDate: string;
  disabilityId: string;
  disabled: boolean;
  onAssigned: (disabilityId: string, replacementEmail: string) => void; // ✅ actualizado
};

export default function AssignReplacementButton({
  userEmail,
  startDate,
  endDate,
  disabilityId,
  disabled,
  onAssigned,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        onClick={() => setOpen(true)}
        disabled={disabled}
        className={disabled ? "opacity-50 cursor-not-allowed" : ""}
      >
        {disabled ? "Reemplazo ya asignado" : "Asignar reemplazo"}
      </Button>
      {!disabled && (
        <AssignReplacementDialog
          open={open}
          onClose={() => setOpen(false)}
          userEmail={userEmail}
          startDate={startDate}
          endDate={endDate}
          disabilityId={disabilityId}
          onAssigned={onAssigned} // ✅ ahora recibirá también el replacementEmail
        />
      )}
    </>
  );
}
