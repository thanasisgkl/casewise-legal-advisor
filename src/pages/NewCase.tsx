
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

const NewCase = () => {
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentTab, setCurrentTab] = useState("description");
  const { isSubmitting, result, isSaving, submitCase, saveCase } = useCaseSubmit();
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    await submitCase(description, selectedCategory);
    setCurrentTab("results");
  };
  
  const handleSaveCase = async () => {
    await saveCase();
    navigate("/history");
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
