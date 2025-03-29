
import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpDown, Calendar, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type CaseHistoryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  summary: string;
};

interface HistoryListProps {
  cases: CaseHistoryItem[];
}

const HistoryList = ({ cases }: HistoryListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortDesc, setSortDesc] = useState(true);
  
  const filteredCases = cases.filter((caseItem) => 
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const sortedCases = [...filteredCases].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDesc ? dateB - dateA : dateA - dateB;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Αναζήτηση υποθέσεων..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setSortDesc(!sortDesc)}
        >
          <ArrowUpDown className="h-4 w-4" />
          Ταξινόμηση: {sortDesc ? "Νεότερα πρώτα" : "Παλαιότερα πρώτα"}
        </Button>
      </div>
      
      {sortedCases.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Καμία υπόθεση</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm 
              ? "Δεν βρέθηκαν υποθέσεις που να ταιριάζουν με την αναζήτησή σας." 
              : "Δεν έχετε αποθηκεύσει καμία υπόθεση ακόμα."}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link to="/new-case">Δημιουργία υπόθεσης</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedCases.map((caseItem) => (
            <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{caseItem.title}</CardTitle>
                    <CardDescription>{caseItem.category}</CardDescription>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-1 h-4 w-4" />
                    {caseItem.date}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{caseItem.summary}</p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" size="sm" className="ml-auto">
                  <Link to={`/case/${caseItem.id}`}>Προβολή</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryList;
