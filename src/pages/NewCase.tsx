
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/Layout/MainLayout";
import CategorySelect from "@/components/CaseForm/CategorySelect";
import CaseDescription from "@/components/CaseForm/CaseDescription";
import LegalResult from "@/components/CaseAnalysis/LegalResult";
import { legalCategories } from "@/data/mockData";
import { useCaseSubmit } from "@/hooks/useCaseSubmit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

const NewCase = () => {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentTab, setCurrentTab] = useState("description");
  const [documentAttached, setDocumentAttached] = useState(false);
  const { isSubmitting, result, isSaving, submitCase, saveCase } = useCaseSubmit();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleSubmit = async () => {
    await submitCase(description, selectedCategory);
    setCurrentTab("results");
  };
  
  const handleSaveCase = async () => {
    await saveCase();
    navigate("/history");
  };

  const handleDocumentUpload = async () => {
    try {
      // Here we would integrate with expo-document-picker
      // Since we're in a web context, we'll simulate the upload
      setTimeout(() => {
        setDocumentAttached(true);
        toast({
          title: "Έγγραφο Επιτυχώς Προσαρτήθηκε",
          description: "Το έγγραφό σας έχει προσαρτηθεί στην υπόθεση."
        });
      }, 500);
    } catch (error) {
      toast({
        title: "Σφάλμα Φόρτωσης",
        description: "Δεν ήταν δυνατή η φόρτωση του εγγράφου.",
        variant: "destructive"
      });
    }
  };

  const handleScanDocument = async () => {
    try {
      // Here we would integrate with expo-image-picker
      // Since we're in a web context, we'll simulate the scanning
      setTimeout(() => {
        setDocumentAttached(true);
        toast({
          title: "Έγγραφο Επιτυχώς Σαρώθηκε",
          description: "Το έγγραφό σας έχει προσαρτηθεί στην υπόθεση."
        });
      }, 1000);
    } catch (error) {
      toast({
        title: "Σφάλμα Σάρωσης",
        description: "Δεν ήταν δυνατή η σάρωση του εγγράφου.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Νέα Υπόθεση</h1>
          <p className="text-gray-600 mt-1">
            Συμπληρώστε τα στοιχεία της υπόθεσής σας για να λάβετε νομική ανάλυση
          </p>
        </div>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="description">Περιγραφή Υπόθεσης</TabsTrigger>
            <TabsTrigger value="results" disabled={!result}>Αποτελέσματα Ανάλυσης</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description">
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Κατηγορία Δικαίου</CardTitle>
                  <CardDescription>
                    Επιλέξτε την κατηγορία που ταιριάζει καλύτερα στην υπόθεσή σας
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CategorySelect
                    categories={legalCategories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Περιγραφή Υπόθεσης</CardTitle>
                  <CardDescription>
                    Περιγράψτε την υπόθεσή σας με λεπτομέρειες για καλύτερη ανάλυση
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CaseDescription
                    value={description}
                    onChange={setDescription}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Έγγραφα Υπόθεσης</CardTitle>
                  <CardDescription>
                    Προσθέστε σχετικά έγγραφα για την υπόθεσή σας
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={handleDocumentUpload} 
                      variant="outline" 
                      className="flex-1"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Μεταφόρτωση Εγγράφου
                    </Button>
                    
                    {isMobile && (
                      <Button 
                        onClick={handleScanDocument} 
                        variant="outline" 
                        className="flex-1"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Σάρωση Εγγράφου
                      </Button>
                    )}
                  </div>
                  
                  {documentAttached && (
                    <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
                      <p className="text-sm flex items-center">
                        <span className="font-medium">Έγγραφο προσαρτήθηκε</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="results">
            {result && (
              <LegalResult
                advice={result}
                onSaveCase={handleSaveCase}
                isSaving={isSaving}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default NewCase;
