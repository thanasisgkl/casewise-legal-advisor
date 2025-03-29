
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Scale, BookOpen, History, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-legal-navy" />
          <span className="text-lg font-bold text-legal-navy">CaseWise</span>
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        
        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-legal-navy transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" /> Αρχική
          </Link>
          <Link to="/new-case" className="text-gray-700 hover:text-legal-navy transition-colors flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> Νέα Υπόθεση
          </Link>
          <Link to="/history" className="text-gray-700 hover:text-legal-navy transition-colors flex items-center gap-1">
            <History className="h-4 w-4" /> Ιστορικό
          </Link>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-md animate-fade-in">
          <nav className="flex flex-col px-4 py-2">
            <Link 
              to="/" 
              className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="h-5 w-5" /> Αρχική
            </Link>
            <Link 
              to="/new-case" 
              className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" /> Νέα Υπόθεση
            </Link>
            <Link 
              to="/history" 
              className="py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <History className="h-5 w-5" /> Ιστορικό
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
