"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { CalendarIcon, X } from "lucide-react" 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
  label: string
  value?: string
  onChange: (dateString: string) => void
}

export function DatePickerLabeled({ label, value, onChange }: Props) {
  const [date, setDate] = React.useState<Date | undefined>(
    value ? parseISO(value) : undefined
  )

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      onChange(selectedDate.toISOString().split("T")[0])
    }
  }

  const clearDate = () => {
    setDate(undefined)
    onChange("")
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="relative w-[240px]">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal pr-10",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Seleccionar fecha</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {date && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearDate}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
