
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CaseDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const CaseDescription = ({
  value,
  onChange,
  onSubmit,
  isSubmitting
}: CaseDescriptionProps) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const minLength = 50;
  const idealLength = 200;
  const currentLength = value.length;
  const progress = Math.min(100, (currentLength / idealLength) * 100);
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          className="min-h-[200px] resize-y p-4"
          placeholder="Περιγράψτε την υπόθεσή σας με όσο το δυνατόν περισσότερες λεπτομέρειες..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <div className={`absolute bottom-3 right-3 text-xs transition-opacity duration-300 ${
          isFocused || currentLength > 0 ? "opacity-100" : "opacity-0"
        }`}>
          {currentLength} / {idealLength}+ χαρακτήρες
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Ελάχιστο: {minLength} χαρακτήρες</span>
          <span>Ιδανικό: {idealLength}+ χαρακτήρες</span>
        </div>
        <Progress value={progress} className="h-1" />
      </div>
      
      <Button
        onClick={onSubmit}
        disabled={currentLength < minLength || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Ανάλυση..." : "Υποβολή για Ανάλυση"}
      </Button>
      
      {currentLength < minLength && (
        <p className="text-sm text-legal-red">
          Παρακαλώ προσθέστε τουλάχιστον {minLength} χαρακτήρες
        </p>
      )}
    </div>
  );
};

export default CaseDescription;
