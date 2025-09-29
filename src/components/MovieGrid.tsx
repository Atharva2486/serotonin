import { useState } from "react";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

interface MovieGridProps {
  movies: Movie[];
  selectedMovieIds: number[];
  onMovieSelect: (movie: Movie) => void;
}

export const MovieGrid = ({ movies, selectedMovieIds, onMovieSelect }: MovieGridProps) => {
  const [selectingMovieId, setSelectingMovieId] = useState<number | null>(null);

  const handleMovieClick = (movie: Movie) => {
    if (selectedMovieIds.includes(movie.id)) return;
    
    setSelectingMovieId(movie.id);
    
    // Add a small delay to show the animation before removing from grid
    setTimeout(() => {
      onMovieSelect(movie);
      setSelectingMovieId(null);
    }, 500);
  };

  const visibleMovies = movies
    .filter(movie => !selectedMovieIds.includes(movie.id))
    .sort((a, b) => b.year - a.year);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
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
  );
};