import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

interface VirtualizedMovieGridProps {
  movies: Movie[];
  selectedMovieIds: number[];
  onMovieSelect: (movie: Movie) => void;
}

export const VirtualizedMovieGrid = ({ movies, selectedMovieIds, onMovieSelect }: VirtualizedMovieGridProps) => {
  const [selectingMovieId, setSelectingMovieId] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  // Show only first 100 movies initially for performance, with lazy loading
  const [displayCount, setDisplayCount] = useState(100);
  
  const handleMovieClick = useCallback((movie: Movie) => {
    if (selectedMovieIds.includes(movie.id)) return;
    
    setSelectingMovieId(movie.id);
    
    // Add a small delay to show the animation before removing from grid
    setTimeout(() => {
      onMovieSelect(movie);
      setSelectingMovieId(null);
    }, 500);
  }, [selectedMovieIds, onMovieSelect]);

  const visibleMovies = useMemo(() => 
    movies.filter(movie => !selectedMovieIds.includes(movie.id)).slice(0, displayCount),
    [movies, selectedMovieIds, displayCount]
  );

  const handleLoadMore = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + 50, movies.length));
  }, [movies.length]);

  // Calculate grid columns based on screen size
  const gridCols = isMobile 
    ? "grid-cols-2" 
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8";

  return (
    <div className="space-y-6">
      <div className={`grid ${gridCols} gap-4`}>
        {visibleMovies.map((movie) => (
          <div
            key={movie.id}
            className={`movie-poster ${selectingMovieId === movie.id ? 'movie-selecting' : ''}`}
            onClick={() => handleMovieClick(movie)}
          >
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
              <img
                src={`/img/${movie.poster}`}
                alt={`${movie.title} (${movie.year})`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                loading="lazy"
              />
              
              {/* Gradient overlay */}
              <div className="movie-poster-overlay" />
              
              {/* Movie info */}
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <h4 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                  {movie.title}
                </h4>
                <p className="text-xs text-gray-300">
                  {movie.year}
                </p>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < movies.filter(movie => !selectedMovieIds.includes(movie.id)).length && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="glass-panel neon-hover"
          >
            Load More Movies ({movies.filter(movie => !selectedMovieIds.includes(movie.id)).length - displayCount} remaining)
          </Button>
        </div>
      )}
    </div>
  );
};