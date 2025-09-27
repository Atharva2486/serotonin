import { useState } from "react";
import { X, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

interface MobileSelectedMoviesProps {
  selectedMovies: Movie[];
  onDeselectMovie: (movieId: number) => void;
}

export const MobileSelectedMovies = ({ selectedMovies, onDeselectMovie }: MobileSelectedMoviesProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedMovies.length === 0) return null;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed top-4 right-4 z-50 h-12 w-12 rounded-full bg-primary/90 backdrop-blur-sm hover:bg-primary neon-glow animate-neon-pulse"
          size="sm"
        >
          <Film className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
            {selectedMovies.length}
          </span>
        </Button>
      </SheetTrigger>
      
      <SheetContent side="top" className="glass-panel border-b border-primary/20">
        <SheetHeader>
          <SheetTitle className="text-left">Selected Movies ({selectedMovies.length})</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-3 max-h-64 overflow-y-auto">
          {selectedMovies.map((movie) => (
            <div
              key={movie.id}
              className="flex items-center justify-between bg-card/30 backdrop-blur-sm border border-primary/10 rounded-lg px-4 py-3"
            >
              <span className="text-foreground text-sm">
                {movie.title} ({movie.year})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeselectMovie(movie.id)}
                className="h-8 w-8 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};