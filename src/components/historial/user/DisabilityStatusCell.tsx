// components/DisabilityStatusCell.tsx
"use client";

import { Button } from "@/components/Button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/HoverCard";

type Props = {
  status: string;
  motivo?: string;
};

const getTextColor = (status: string) => {
  switch (status) {
    case "pending":
      return "text-slate-500";
    case "transcrita":
      return "text-blue-600";
    case "rechazada":
      return "text-red-600";
    case "pagada":
      return "text-green-600";
    default:
      return "text-gray-500";
  }
};

export default function DisabilityStatusCell({ status, motivo }: Props) {
  const textColor = getTextColor(status);

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-medium ${textColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
      {status === "rechazada" && motivo && (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link" className="text-xs p-0 h-auto">
              Ver motivo
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="max-w-[300px] text-sm">
            {motivo}
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
}
