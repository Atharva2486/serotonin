import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

interface SelectedMoviesProps {
  selectedMovies: Movie[];
  onDeselectMovie: (movieId: number) => void;
}

export const SelectedMovies = ({ selectedMovies, onDeselectMovie }: SelectedMoviesProps) => {
  if (selectedMovies.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Selected Movies</h3>
        <span className="text-sm text-muted-foreground bg-primary/10 px-3 py-1 rounded-full">
          {selectedMovies.length} selected
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {selectedMovies.map((movie) => (
          <div
            key={movie.id}
            className="flex items-center gap-2 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 text-sm animate-movie-appear"
          >
            <span className="text-foreground">
              {movie.title} ({movie.year})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeselectMovie(movie.id)}
              className="h-6 w-6 p-0 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};