
import MainLayout from "@/components/Layout/MainLayout";
import HistoryList from "@/components/CaseHistory/HistoryList";
import { historyCases } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

const History = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Ιστορικό Υποθέσεων</h1>
            <p className="text-gray-600 mt-1">
              Προβολή και διαχείριση των αποθηκευμένων υποθέσεών σας
            </p>
          </div>
          
          <Button asChild>
            <Link to="/new-case">
              <Plus className="mr-2 h-4 w-4" />
              Νέα Υπόθεση
            </Link>
          </Button>
        </div>
        
        <HistoryList cases={historyCases} />
      </div>
    </MainLayout>
  );
};

export default History;
