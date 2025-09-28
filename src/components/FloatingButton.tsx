import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleGetSuggestions = async () => {
    if (selectedMovies.length === 0) {
      return;
    }

    const movieIds = selectedMovies.map(movie => movie.id);
    
    // Store data in dataset.json format
    
    try {
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
      const result = await response.json();
      console.log("Storing submission:", submissionData);
      console.log('Success:', result.message);
      navigate("/thank-you");
    } else {
      throw new Error('Failed to save suggestions');
    }
  } catch (error) {
    console.error("Error saving suggestions:", error);
    alert("Sorry, we couldn't save your selections at this time.");
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
