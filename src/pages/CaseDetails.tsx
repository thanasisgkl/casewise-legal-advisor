
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Flag, Printer, Share2 } from "lucide-react";
import MainLayout from "@/components/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { historyCases } from "@/data/mockData";
import { mockAnalysis } from "@/data/mockData";

// Add mock outcomes data for case details
const mockOutcomes = [
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
];

const CaseDetails = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState<any | null>(null);
  
  useEffect(() => {
    // In a real app, we would fetch this data from an API
    const foundCase = historyCases.find(c => c.id === id);
    if (foundCase) {
      setCaseData({
        ...foundCase,
        analysis: {
          ...mockAnalysis,
          outcomes: mockOutcomes
        }
      });
    }
  }, [id]);
  
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
  
  if (!caseData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-medium">Φόρτωση υπόθεσης...</h2>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/history" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Επιστροφή στο Ιστορικό
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{caseData.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-gray-500">
                <div className="flex items-center gap-1">
                  <Flag className="h-4 w-4" />
                  {caseData.category}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {caseData.date}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Εκτύπωση
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Κοινοποίηση
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Περιγραφή Υπόθεσης</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{caseData.summary}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Περίληψη Ανάλυσης</CardTitle>
              <CardDescription>Βασικά σημεία της νομικής ανάλυσης</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium">{caseData.analysis.summary}</p>
              <Separator className="my-4" />
              <div className="space-y-4">
                <h3 className="font-medium">Αναλυτικές Πληροφορίες</h3>
                <p className="text-gray-700">{caseData.analysis.details}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Πιθανότητες Έκβασης</CardTitle>
              <CardDescription>Αξιολόγηση πιθανοτήτων για διαφορετικά σενάρια της υπόθεσής σας</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.analysis.outcomes?.map((outcome: any, index: number) => (
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Προτεινόμενες Ενέργειες</CardTitle>
                <CardDescription>Συστάσεις για τα επόμενα βήματα</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {caseData.analysis.recommendations.map((recommendation: string, index: number) => (
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
                <CardDescription>Άρθρα και νομολογία</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[180px] rounded-md">
                  <div className="space-y-4 pr-4">
                    {caseData.analysis.references.map((reference: any) => (
                      <div key={reference.id} className="space-y-1">
                        <h4 className="font-medium">{reference.title}</h4>
                        <p className="text-sm text-gray-600">{reference.description}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CaseDetails;
