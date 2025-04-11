import { useState } from "react";
import { Link } from "react-router-native";
import { Menu, X, Scale, BookOpen, History, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 50,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  container: {
    marginHorizontal: 'auto',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  nav: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  link: {
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mobileMenu: {
    display: 'none',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mobileNav: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  mobileLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 6,
  },
});

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Link to="/" style={styles.logo}>
          <Scale style={{ height: 24, width: 24, color: '#1e3a8a' }} />
          <Text style={styles.logoText}>CaseWise</Text>
        </Link>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          style={{ display: 'none' }}
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X style={{ height: 24, width: 24 }} />
          ) : (
            <Menu style={{ height: 24, width: 24 }} />
          )}
        </Button>
        
        {/* Desktop menu */}
        <View style={styles.nav}>
          <Link to="/" style={styles.link}>
            <Home style={{ height: 16, width: 16 }} /> Αρχική
          </Link>
          <Link to="/new-case" style={styles.link}>
            <BookOpen style={{ height: 16, width: 16 }} /> Νέα Υπόθεση
          </Link>
          <Link to="/history" style={styles.link}>
            <History style={{ height: 16, width: 16 }} /> Ιστορικό
          </Link>
        </View>
      </View>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <View style={styles.mobileMenu}>
          <View style={styles.mobileNav}>
            <Link 
              to="/" 
              style={styles.mobileLink}
              onPress={() => setIsMenuOpen(false)}
            >
              <Home style={{ height: 20, width: 20 }} /> Αρχική
            </Link>
            <Link 
              to="/new-case" 
              style={styles.mobileLink}
              onPress={() => setIsMenuOpen(false)}
            >
              <BookOpen style={{ height: 20, width: 20 }} /> Νέα Υπόθεση
            </Link>
            <Link 
              to="/history" 
              style={styles.mobileLink}
              onPress={() => setIsMenuOpen(false)}
            >
              <History style={{ height: 20, width: 20 }} /> Ιστορικό
            </Link>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
