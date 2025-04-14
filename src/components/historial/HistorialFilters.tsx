"use client";

import { Input } from "@/components/Input";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

type Props = {
  isAdmin: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  startDate?: string;
  endDate?: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  allStatuses: string[];
  selectedStatuses: string[];
  onToggleStatus: (status: string) => void;
};

export default function HistorialFilters({
  isAdmin,
  search,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  allStatuses,
  selectedStatuses,
  onToggleStatus,
}: Props) {
  return (
    <div className="flex justify-between w-full items-start  gap-10">
      <div className="flex gap-4 items-center">
        {isAdmin && (
          <Input
            placeholder="Buscar por correo"
            className="w-64"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

        <div className="flex gap-4">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange?.(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange?.(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col flex-wrap gap-4 items-start">
        <div className="flex items-center gap-2">
          <ListFilter />
          <p>Filtrar por estado:</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {allStatuses.map((status) => (
            <Button
              key={status}
              variant={
                selectedStatuses.includes(status) ? "default" : "outline"
              }
              onClick={() => onToggleStatus(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
