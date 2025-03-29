
import { useState } from "react";
import { mockAnalysis } from "@/data/mockData";
import { useToast } from "@/components/ui/use-toast";
import { LegalAdvice } from "@/components/CaseAnalysis/LegalResult";

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
    
    // Use mock data for now
    setResult(mockAnalysis);
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
