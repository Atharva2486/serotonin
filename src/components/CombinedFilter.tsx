import { useState } from "react";
import { Filter, Check, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import genresData from "@/data/genres.json";

interface CombinedFilterProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  minYear: number;
  maxYear: number;
}

export const CombinedFilter = ({ 
  selectedGenres, 
  onGenreToggle, 
  yearRange, 
  onYearRangeChange,
  minYear,
  maxYear
}: CombinedFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (values: number[]) => {
    onYearRangeChange([values[0], values[1]]);
  };

  const isFiltered = selectedGenres.length > 0 || yearRange[0] !== minYear || yearRange[1] !== maxYear;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-14 px-6 glass-panel border-2 border-secondary/20 hover:border-secondary hover:neon-glow transition-all duration-300"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filters
          {isFiltered && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {selectedGenres.length + (yearRange[0] !== minYear || yearRange[1] !== maxYear ? 1 : 0)}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 glass-panel border-primary/20">
        <div className="space-y-6">
          {/* Year Range Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-medium text-foreground">Release Year</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{yearRange[0]}</span>
                <span>{yearRange[1]}</span>
              </div>
              <Slider
                value={[yearRange[0], yearRange[1]]}
                onValueChange={handleSliderChange}
                min={minYear}
                max={maxYear}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minYear}</span>
                <span>{maxYear}</span>
              </div>
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Genres Filter */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Genres</h4>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {genresData.map((genre) => (
                <div
                  key={genre}
                  onClick={() => onGenreToggle(genre)}
                  className="flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors p-2 rounded"
                >
                  <span className="text-sm">{genre}</span>
                  {selectedGenres.includes(genre) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};