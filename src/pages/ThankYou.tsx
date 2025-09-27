import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent mb-6">
            Thank You!
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Thank you for submitting your favorite movies. Bollywood movies' dataset is not prepared yet.
          </p>
          
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-neon hover:shadow-neon transition-all duration-300 text-white font-semibold px-8 py-3"
          >
            Go to Home Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;