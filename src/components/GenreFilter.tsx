import { useState } from "react";
import { Filter, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import genresData from "@/data/genres.json";

interface GenreFilterProps {
  selectedGenres: string[];
  onGenreToggle: (genre: string) => void;
}

export const GenreFilter = ({ selectedGenres, onGenreToggle }: GenreFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-14 px-6 glass-panel border-2 border-secondary/20 hover:border-secondary hover:neon-glow transition-all duration-300"
        >
          <Filter className="h-5 w-5 mr-2" />
          Genres
          {selectedGenres.length > 0 && (
            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
              {selectedGenres.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-panel border-primary/20">
        {genresData.map((genre) => (
          <DropdownMenuItem
            key={genre}
            onClick={() => onGenreToggle(genre)}
            className="flex items-center justify-between cursor-pointer hover:bg-primary/10 transition-colors"
          >
            <span>{genre}</span>
            {selectedGenres.includes(genre) && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};