"use client";

import { useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MonthYearPickerProps {
  value: { month: number; year: number };
  onChange: (value: { month: number; year: number }) => void;
  placeholder?: string;
}

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export function MonthYearPicker({
  value,
  onChange,
  placeholder = "Select Month and Year",
}: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - 5 + i);

  const selectedMonth = months.find((m) => m.value === value.month);
  const displayValue = selectedMonth
    ? `${selectedMonth.label} ${value.year}`
    : placeholder;

  const handleMonthChange = (monthValue: string) => {
    onChange({
      ...value,
      month: Number.parseInt(monthValue),
    });
  };

  const handleYearChange = (yearValue: string) => {
    onChange({
      ...value,
      year: Number.parseInt(yearValue),
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {displayValue}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Month</label>
            <Select
              value={value.month.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value.toString()}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Select
              value={value.year.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => setOpen(false)} className="w-full">
            Submit
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
