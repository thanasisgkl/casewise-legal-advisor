
import { useState } from "react";
import { mockAnalysis } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { LegalAdvice } from "@/components/CaseAnalysis/LegalResult";

// Extend the mock data to include outcomes
const extendedMockAnalysis = {
  ...mockAnalysis,
  outcomes: [
    {
      scenario: "Θετική έκβαση της υπόθεσης",
      probability: 75,
      reasoning: "Με βάση την νομολογία και τα στοιχεία που παρουσιάστηκαν, υπάρχει υψηλή πιθανότητα ευνοϊκής απόφασης λόγω των σαφών προηγούμενων περιπτώσεων."
    },
    {
      scenario: "Μερική αποδοχή των αιτημάτων",
      probability: 60,
      reasoning: "Το δικαστήριο ενδέχεται να αποδεχθεί μέρος των αιτημάτων σας, ειδικά όσον αφορά τα κύρια σημεία της διαφοράς, αλλά πιθανόν να απορρίψει δευτερεύοντα ζητήματα."
    },
    {
      scenario: "Αρνητική έκβαση της υπόθεσης",
      probability: 20,
      reasoning: "Υπάρχει μικρή πιθανότητα αρνητικής έκβασης, κυρίως εάν το δικαστήριο δώσει μεγαλύτερη βαρύτητα στις πρόσφατες νομοθετικές αλλαγές."
    }
  ]
};

export const useCaseSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<LegalAdvice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const submitCase = async (description: string, category: string) => {
    if (!description || !category) {
      toast({
        title: "Συμπληρώστε όλα τα πεδία",
        description: "Παρακαλώ συμπληρώστε την περιγραφή της υπόθεσης και επιλέξτε κατηγορία.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use extended mock data with outcomes
    setResult(extendedMockAnalysis as LegalAdvice);
    setIsSubmitting(false);
    
    toast({
      title: "Επιτυχής Ανάλυση",
      description: "Η υπόθεσή σας αναλύθηκε με επιτυχία.",
    });
  };

  const saveCase = async () => {
    if (!result) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    
    toast({
      title: "Η υπόθεση αποθηκεύτηκε",
      description: "Η υπόθεση αποθηκεύτηκε στο ιστορικό σας.",
    });
  };

  return { isSubmitting, result, isSaving, submitCase, saveCase };
};
