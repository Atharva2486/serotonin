import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClearFiltersButtonProps {
  onClearAll: () => void;
  hasFilters: boolean;
}

export const ClearFiltersButton = ({ onClearAll, hasFilters }: ClearFiltersButtonProps) => {
  if (!hasFilters) return null;

  return (
    <Button
      variant="outline"
      onClick={onClearAll}
      className="glass-panel border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 text-destructive hover:text-destructive"
    >
      <RotateCcw className="h-4 w-4 mr-2" />
      Clear All
    </Button>
  );
};