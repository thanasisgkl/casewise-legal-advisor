
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CardFeature } from "@/components/ui/card-feature";
import MainLayout from "@/components/Layout/MainLayout";
import { BookOpen, Scale, History, FileText, ShieldCheck, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center text-center space-y-6 py-10">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white rounded-full p-4 shadow-md">
            <Scale className="h-16 w-16 text-legal-navy" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-legal-navy">CaseWise</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Ο προσωπικός σας νομικός σύμβουλος που αναλύει την υπόθεσή σας και παρέχει εξατομικευμένες συμβουλές με βάση την ελληνική νομοθεσία.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button asChild size="lg" className="text-base px-6 py-6">
            <Link to="/new-case">
              <FileText className="mr-2 h-5 w-5" />
              Δημιουργία Νέας Υπόθεσης
            </Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="text-base px-6 py-6">
            <Link to="/history">
              <History className="mr-2 h-5 w-5" />
              Προβολή Ιστορικού
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="py-16">
        <h2 className="text-2xl font-bold text-center mb-8">Πώς Λειτουργεί</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-legal-navy/10 rounded-full p-4">
              <FileText className="h-8 w-8 text-legal-navy" />
            </div>
            <h3 className="text-lg font-medium">1. Εισάγετε την υπόθεσή σας</h3>
            <p className="text-gray-600">Περιγράψτε την υπόθεσή σας με όσο το δυνατόν περισσότερες λεπτομέρειες.</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-legal-navy/10 rounded-full p-4">
              <Sparkles className="h-8 w-8 text-legal-navy" />
            </div>
            <h3 className="text-lg font-medium">2. Λάβετε ανάλυση</h3>
            <p className="text-gray-600">Το σύστημα αναλύει την υπόθεση και παρέχει εξατομικευμένες νομικές συμβουλές.</p>
          </div>
          
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-legal-navy/10 rounded-full p-4">
              <BookOpen className="h-8 w-8 text-legal-navy" />
            </div>
            <h3 className="text-lg font-medium">3. Δείτε τις προτάσεις</h3>
            <p className="text-gray-600">Λάβετε συγκεκριμένες προτάσεις και παραπομπές σε σχετική νομοθεσία.</p>
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-legal-gray rounded-lg px-6">
        <h2 className="text-2xl font-bold text-center mb-8">Δυνατότητες</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardFeature
            icon={ShieldCheck}
            title="Νομική Προστασία"
            description="Κατανοήστε τα δικαιώματά σας και πώς να τα προστατεύσετε με τον καλύτερο τρόπο."
          />
          
          <CardFeature
            icon={FileText}
            title="Ανάλυση Υποθέσεων"
            description="Λεπτομερής ανάλυση της υπόθεσής σας βασισμένη στην ελληνική νομοθεσία."
          />
          
          <CardFeature
            icon={BookOpen}
            title="Νομικές Παραπομπές"
            description="Πρόσβαση σε σχετικά άρθρα και νομολογία που αφορούν την υπόθεσή σας."
          />
          
          <CardFeature
            icon={History}
            title="Ιστορικό Υποθέσεων"
            description="Αποθήκευση και παρακολούθηση όλων των υποθέσεών σας σε ένα μέρος."
          />
          
          <CardFeature
            icon={Scale}
            title="Πολλαπλές Κατηγορίες"
            description="Υποστήριξη για αστικό, ποινικό, εργατικό και άλλους τομείς δικαίου."
          />
          
          <CardFeature
            icon={Sparkles}
            title="Έξυπνες Προτάσεις"
            description="Εξατομικευμένες προτάσεις και επόμενα βήματα για την υπόθεσή σας."
          />
        </div>
      </div>
      
      <div className="py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Έτοιμοι να ξεκινήσετε;</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Δημιουργήστε την πρώτη σας υπόθεση και λάβετε άμεσα νομικές συμβουλές προσαρμοσμένες στις ανάγκες σας.
        </p>
        <Button asChild size="lg">
          <Link to="/new-case">Δημιουργία Υπόθεσης</Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default Index;
