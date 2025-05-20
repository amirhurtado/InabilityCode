"use client";

import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { ListFilter } from "lucide-react";
import { DatePickerLabeled } from "../DatePickerLabeled";

type Props = {
  isAdmin?: boolean;
  isLider?: boolean;
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
  isAdmin = false,
  isLider = false,
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
        {(isAdmin || isLider) && (
          <Input
            placeholder="Buscar por correo"
            className="w-64"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        )}

        <div className="flex gap-4">
          <DatePickerLabeled
            label="Fecha inicio"
            value={startDate}
            onChange={(date) => onStartDateChange?.(date)}
          />
          <DatePickerLabeled
            label="Fecha fin"
            value={endDate}
            onChange={(date) => onEndDateChange?.(date)}
          />
        </div>
      </div>

      {!isLider && (
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
      )}
    </div>
  );
}
