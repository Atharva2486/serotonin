import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchBar } from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter";
import { SelectedMovies } from "@/components/SelectedMovies";
import { MobileSelectedMovies } from "@/components/MobileSelectedMovies";
import { MovieGrid } from "@/components/MovieGrid";
import { FloatingButton } from "@/components/FloatingButton";
import moviesData from "@/data/movies.json";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const isMobile = useIsMobile();

  // Filter movies based on search term and selected genres
  const filteredMovies = useMemo(() => {
    return moviesData.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genres.includes(genre));
      
      return matchesSearch && matchesGenres;
    });
  }, [searchTerm, selectedGenres]);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovies(prev => [...prev, movie]);
  };

  const handleMovieDeselect = (movieId: number) => {
    setSelectedMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  const selectedMovieIds = selectedMovies.map(movie => movie.id);

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-neon bg-clip-text text-transparent mb-4">
            Movie Survey
          </h1>
          <p className="text-xl text-muted-foreground">
            Select your favorite movies to get personalized recommendations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <GenreFilter selectedGenres={selectedGenres} onGenreToggle={handleGenreToggle} />
        </div>

        {/* Selected Movies - Desktop */}
        {!isMobile && (
          <div className="mb-8">
            <SelectedMovies 
              selectedMovies={selectedMovies} 
              onDeselectMovie={handleMovieDeselect} 
            />
          </div>
        )}

        {/* Selected Movies - Mobile Floating Menu */}
        {isMobile && (
          <MobileSelectedMovies 
            selectedMovies={selectedMovies} 
            onDeselectMovie={handleMovieDeselect} 
          />
        )}

        {/* Movie Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Available Movies
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredMovies.filter(movie => !selectedMovieIds.includes(movie.id)).length} movies
            </span>
          </div>
          
          <MovieGrid 
            movies={filteredMovies}
            selectedMovieIds={selectedMovieIds}
            onMovieSelect={handleMovieSelect}
          />
        </div>

        {/* Floating Get Suggestions Button */}
        <FloatingButton selectedMovies={selectedMovies} />
      </div>
    </div>
  );
};

export default Index;