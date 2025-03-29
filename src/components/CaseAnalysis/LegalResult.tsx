
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, FilePlus, FileText } from "lucide-react";

export type LegalReference = {
  id: string;
  title: string;
  description: string;
};

export type CaseOutcome = {
  scenario: string;
  probability: number;
  reasoning: string;
};

export type LegalAdvice = {
  summary: string;
  details: string;
  recommendations: string[];
  references: LegalReference[];
  outcomes: CaseOutcome[];
};

interface LegalResultProps {
  advice: LegalAdvice;
  onSaveCase: () => void;
  isSaving: boolean;
}

const LegalResult = ({ advice, onSaveCase, isSaving }: LegalResultProps) => {
  // Helper function to get color based on probability
  const getProbabilityColor = (probability: number): string => {
    if (probability >= 70) return "text-green-700";
    if (probability >= 40) return "text-amber-700";
    return "text-red-700";
  };

  // Helper function to get background color based on probability
  const getProbabilityBgColor = (probability: number): string => {
    if (probability >= 70) return "bg-green-50";
    if (probability >= 40) return "bg-amber-50";
    return "bg-red-50";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Περίληψη Ανάλυσης</CardTitle>
          <CardDescription>Βασικά σημεία της νομικής ανάλυσης της υπόθεσής σας</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium">{advice.summary}</p>
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="font-medium">Αναλυτικές Πληροφορίες</h3>
            <p className="text-gray-700">{advice.details}</p>
          </div>
        </CardContent>
      </Card>

      {advice.outcomes && advice.outcomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Πιθανότητες Έκβασης</CardTitle>
            <CardDescription>Αξιολόγηση πιθανοτήτων για διαφορετικά σενάρια της υπόθεσής σας</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {advice.outcomes.map((outcome, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-md border ${getProbabilityBgColor(outcome.probability)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{outcome.scenario}</h4>
                    <div className={`font-bold text-lg ${getProbabilityColor(outcome.probability)}`}>
                      {outcome.probability}%
                    </div>
                  </div>
                  <p className="text-gray-700">{outcome.reasoning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Προτεινόμενες Ενέργειες</CardTitle>
          <CardDescription>Συστάσεις για τα επόμενα βήματα</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {advice.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 h-5 w-5 rounded-full bg-legal-navy/10 text-legal-navy flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Σχετικές Νομικές Αναφορές</CardTitle>
          <CardDescription>Άρθρα και νομολογία που σχετίζονται με την υπόθεσή σας</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px] rounded-md border p-4">
            <div className="space-y-4">
              {advice.references.map((reference) => (
                <div key={reference.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-legal-navy" />
                    <h4 className="font-medium">{reference.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{reference.description}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          onClick={onSaveCase}
          disabled={isSaving}
          className="flex-1"
        >
          <FilePlus className="mr-2 h-4 w-4" />
          {isSaving ? "Αποθήκευση..." : "Αποθήκευση Υπόθεσης"}
        </Button>
        
        <Button variant="outline" className="flex-1">
          <BookOpen className="mr-2 h-4 w-4" />
          Περισσότερες Πληροφορίες
        </Button>
      </div>
    </div>
  );
};

export default LegalResult;
