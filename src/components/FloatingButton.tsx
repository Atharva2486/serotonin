import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

interface FloatingButtonProps {
  selectedMovies: Movie[];
}

export const FloatingButton = ({ selectedMovies }: FloatingButtonProps) => {
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    if (selectedMovies.length === 0) {
      toast({
        title: "No movies selected",
        description: "Please select some movies to get suggestions.",
        variant: "destructive",
      });
      return;
    }

    const movieIds = selectedMovies.map(movie => movie.id);
    
    try {
      // This would normally be your backend endpoint
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movie_ids: movieIds
        }),
      });

      if (response.ok) {
        toast({
          title: "Suggestions requested!",
          description: `Processing suggestions for ${selectedMovies.length} movies...`,
        });
      } else {
        throw new Error('Failed to get suggestions');
      }
    } catch (error) {
      toast({
        title: "Demo Mode",
        description: `Would send ${selectedMovies.length} movie IDs: [${movieIds.join(', ')}] to backend for suggestions.`,
      });
    }
  };

  return (
    <Button
      onClick={handleGetSuggestions}
      className="fixed bottom-6 right-6 h-14 px-6 bg-gradient-neon hover:shadow-neon floating-btn transition-all duration-300 text-white font-semibold"
      disabled={selectedMovies.length === 0}
    >
      <Sparkles className="h-5 w-5 mr-2" />
      Get Suggestions
      {selectedMovies.length > 0 && (
        <span className="ml-2 bg-white/20 rounded-full px-2 py-1 text-xs">
          {selectedMovies.length}
        </span>
      )}
    </Button>
  );
};