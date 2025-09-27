import { useState, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SearchBar } from "@/components/SearchBar";
import { GenreFilter } from "@/components/GenreFilter";
import { YearFilter } from "@/components/YearFilter";
import { ClearFiltersButton } from "@/components/ClearFiltersButton";
import { SelectedMovies } from "@/components/SelectedMovies";
import { MobileSelectedMovies } from "@/components/MobileSelectedMovies";
import { VirtualizedMovieGrid } from "@/components/VirtualizedMovieGrid";
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
  const [yearRange, setYearRange] = useState<{ min: number | null; max: number | null }>({ min: null, max: null });
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const isMobile = useIsMobile();

  // Filter movies based on search term, selected genres, and year range
  const filteredMovies = useMemo(() => {
    return moviesData.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenres = selectedGenres.length === 0 || 
        selectedGenres.some(genre => movie.genres.includes(genre));
      const matchesYearRange = (yearRange.min === null || movie.year >= yearRange.min) &&
        (yearRange.max === null || movie.year <= yearRange.max);
      
      return matchesSearch && matchesGenres && matchesYearRange;
    });
  }, [searchTerm, selectedGenres, yearRange]);

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

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedGenres([]);
    setYearRange({ min: null, max: null });
    setSelectedMovies([]);
  };

  const hasFilters = searchTerm !== "" || selectedGenres.length > 0 || 
    yearRange.min !== null || yearRange.max !== null || selectedMovies.length > 0;

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

        {/* Search and Filter - Sticky on scroll */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-primary/20 pb-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <div className="flex flex-wrap gap-2">
              <GenreFilter selectedGenres={selectedGenres} onGenreToggle={handleGenreToggle} />
              <YearFilter yearRange={yearRange} onYearRangeChange={setYearRange} />
              <ClearFiltersButton onClearAll={handleClearAllFilters} hasFilters={hasFilters} />
            </div>
          </div>
        </div>

        {/* Selected Movies - Desktop (Sticky) */}
        {!isMobile && (
          <div className="sticky top-24 z-30 bg-background/95 backdrop-blur-md border-b border-primary/10 pb-6 mb-8">
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
          
          <VirtualizedMovieGrid 
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