"use client";

import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/HoverCard";

type Props = {
  observation: string;
};

export default function ObservationInfoIcon({ observation }: Props) {
  if (!observation) return null;

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
      </HoverCardTrigger>
      <HoverCardContent className="max-w-[300px] text-sm">
        {observation}
      </HoverCardContent>
    </HoverCard>
  );
}
