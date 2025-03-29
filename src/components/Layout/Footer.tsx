
import { Scale } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-legal-navy text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Scale className="h-5 w-5 mr-2" />
            <span className="font-semibold">CaseWise</span>
          </div>
          
          <div className="text-sm text-gray-300 text-center md:text-right">
            <p>Η εφαρμογή παρέχει μόνο γενικές πληροφορίες και δεν αποτελεί νομική συμβουλή.</p>
            <p className="mt-1">© {new Date().getFullYear()} CaseWise - Όλα τα δικαιώματα διατηρούνται</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
