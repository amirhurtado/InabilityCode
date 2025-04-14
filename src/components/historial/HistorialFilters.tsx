"use client";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  allStatuses: string[];
  selectedStatuses: string[];
  onToggleStatus: (status: string) => void;
};

export default function HistorialFilters({
  search,
  onSearchChange,
  allStatuses,
  selectedStatuses,
  onToggleStatus,
}: Props) {
  return (
    <div className="flex items-start gap-10">
      <Input
        placeholder="Buscar por correo"
        className="max-w-xs"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <ListFilter />
          <p>Filtrar por estado:</p>
        </div>
        {allStatuses.map((status) => (
          <Button
            key={status}
            variant={selectedStatuses.includes(status) ? "default" : "outline"}
            onClick={() => onToggleStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
}
