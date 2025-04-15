"use client";

import { Info } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/HoverCard";

type Props = {
  email: string;
};

export default function AssignedInfoIcon({ email }: Props) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-primary">
          <Info size={18} />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="text-sm max-w-sm">
        <p className="font-semibold mb-1">Colaborador asignado:</p>
        <p className="text-muted-foreground">{email}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
