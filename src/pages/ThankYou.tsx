import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import moviesData from "@/data/movies.json";

interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  poster: string;
}

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movieIds = location.state?.movieIds || [];
  
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [suggestedMovies, setSuggestedMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");

  useEffect(() => {
    if (movieIds.length === 0) {
      setLoading(false);
      return;
    }

    // Simulate progress while connecting
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 300);

    // Establish WebSocket connection
    const ws = new WebSocket('wss://nonperceptive-spined-aidyn.ngrok-free.dev'); // Replace with your server URL
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ movieIds }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const suggestedIds = data.suggestedMovieIds || [];
      
      // Get movie details from the data
      const movies = moviesData.filter((movie: Movie) => 
        suggestedIds.includes(movie.id)
      );
      
      setSuggestedMovies(movies);
      setProgress(100);
      clearInterval(progressInterval);
      
      setTimeout(() => {
        setLoading(false);
      }, 500);
      
      ws.close();
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      clearInterval(progressInterval);
      setError("Oops! Our recommendation wizard seems to be taking a coffee break ☕️");
      setErrorDetails(`Connection failed: Unable to reach ws://10.81.69.33:8765`);
      setLoading(false);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      clearInterval(progressInterval);
      ws.close();
    };
  }, [movieIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Loading...</h2>
            <Progress value={progress} className="mb-4" />
            <p className="text-muted-foreground">Getting your recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">🎬 Uh-oh!</h2>
            <p className="text-muted-foreground mb-6 text-lg">{error}</p>
            <p className="text-muted-foreground mb-8">
              Don't worry, it happens to the best of us! Try again in a moment.
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-neon hover:shadow-neon transition-all duration-300 text-white font-semibold px-8 py-3"
            >
              Back to Movies
            </Button>
            {errorDetails && (
              <div className="mt-8 p-4 bg-muted/20 rounded-lg border border-border/30">
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {errorDetails}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent mb-4">
            Your Recommended Movies
          </h1>
          <p className="text-muted-foreground mb-6">
            Based on your selections, here are our suggestions
          </p>
        </div>

        {suggestedMovies.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4">
            {suggestedMovies.map((movie) => (
              <div
                key={movie.id}
                className="movie-poster cursor-default"
              >
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg">
                  <img
                    src={`/img/${movie.poster}`}
                    alt={`${movie.title} (${movie.year})`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  <div className="movie-poster-overlay" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h4 className="font-semibold text-sm leading-tight mb-1 line-clamp-2">
                      {movie.title}
                    </h4>
                    <p className="text-xs text-gray-300">
                      {movie.year}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestedMovies.length > 0 && (
          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-neon hover:shadow-neon transition-all duration-300 text-white font-semibold px-8 py-3"
            >
              Go to Home Page
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
