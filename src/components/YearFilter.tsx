import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

interface YearFilterProps {
  yearRange: { min: number | null; max: number | null };
  onYearRangeChange: (range: { min: number | null; max: number | null }) => void;
}

export const YearFilter = ({ yearRange, onYearRangeChange }: YearFilterProps) => {
  const handleMinYearChange = (value: string) => {
    const year = value ? parseInt(value) : null;
    onYearRangeChange({ ...yearRange, min: year });
  };

  const handleMaxYearChange = (value: string) => {
    const year = value ? parseInt(value) : null;
    onYearRangeChange({ ...yearRange, max: year });
  };

  const hasFilter = yearRange.min !== null || yearRange.max !== null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={hasFilter ? "default" : "outline"}
          className={`glass-panel ${hasFilter ? 'bg-primary/20 border-primary/40' : ''}`}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Year
          {hasFilter && (
            <span className="ml-2 bg-primary/30 rounded-full px-2 py-0.5 text-xs">
              {yearRange.min || '?'}–{yearRange.max || '?'}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-panel" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none text-foreground">Filter by Year Range</h4>
            <p className="text-sm text-muted-foreground">
              Set a year range to filter movies
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-year" className="text-sm font-medium">From</Label>
              <Input
                id="min-year"
                type="number"
                placeholder="1900"
                min="1900"
                max="2030"
                value={yearRange.min?.toString() || ''}
                onChange={(e) => handleMinYearChange(e.target.value)}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-year" className="text-sm font-medium">To</Label>
              <Input
                id="max-year"
                type="number"
                placeholder="2024"
                min="1900"
                max="2030"
                value={yearRange.max?.toString() || ''}
                onChange={(e) => handleMaxYearChange(e.target.value)}
                className="glass"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};