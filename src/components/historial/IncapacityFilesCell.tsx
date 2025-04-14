// components/IncapacityFilesCell.tsx
"use client";

import { Button } from "@/components/Button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/HoverCard";
import { getLabelFromKey } from "@/lib/utils";

type Props = {
  files: Record<string, string>;
};

export default function IncapacityFilesCell({ files }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {Object.entries(files).map(([key, url]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground capitalize w-[10rem]">
            {getLabelFromKey(key)}
          </span>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                className="text-sm text-primary hover:underline p-0 h-auto"
              >
                Ver PDF
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-[400px] h-[300px] p-0">
              <iframe src={url} width="100%" height="100%" />
            </HoverCardContent>
          </HoverCard>
        </div>
      ))}
    </div>
  );
}
