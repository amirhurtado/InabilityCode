"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import AssignReplacementDialog from "./AssignReplacementDialog";

type Props = {
    userId: string;
    startDate: string;
    endDate: string;
    disabilityId: string;
    disabled: boolean;
    onAssigned: (disabilityId: string) => void; // 👈 nuevo
  };
  
  export default function AssignReplacementButton({
    userId,
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
            userId={userId}
            startDate={startDate}
            endDate={endDate}
            disabilityId={disabilityId}
            onAssigned={onAssigned} // 👈 lo pasas
          />
        )}
      </>
    );
  }
  