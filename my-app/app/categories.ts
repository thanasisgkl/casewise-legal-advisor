export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories?: Category[];
  relatedCategories?: string[]; // IDs των σχετικών κατηγοριών
}

export const categories: Category[] = [
  {
    id: 'civil',
    name: 'Αστικό Δίκαιο',
    description: 'Υποθέσεις που αφορούν τις σχέσεις μεταξύ ιδιωτών',
    subcategories: [
      {
        id: 'family',
        name: 'Οικογενειακό Δίκαιο',
        description: 'Υποθέσεις που αφορούν οικογενειακές σχέσεις',
        subcategories: [
          {
            id: 'divorce',
            name: 'Διαζύγια',
            description: 'Διαδικασίες διαζυγίου και σχετικές υποθέσεις'
          },
          {
            id: 'custody',
            name: 'Επιμέλεια τέκνων',
            description: 'Υποθέσεις επιμέλειας και επικοινωνίας με τέκνα'
          },
          {
            id: 'alimony',
            name: 'Διατροφές',
            description: 'Υποθέσεις διατροφών και οικονομικής υποστήριξης'
          }
        ]
      },
      {
        id: 'property',
        name: 'Εμπράγματο Δίκαιο',
        description: 'Υποθέσεις που αφορούν περιουσιακά δικαιώματα',
        subcategories: [
          {
            id: 'property_disputes',
            name: 'Εμπράγματες διαφορές',
            description: 'Διαφορές σχετικά με ακίνητα και περιουσιακά στοιχεία'
          },
          {
            id: 'cadastral',
            name: 'Κτηματολογικές υποθέσεις',
            description: 'Υποθέσεις σχετικά με το κτηματολόγιο'
          }
        ]
      },
      {
        id: 'contractual',
        name: 'Ενοχικό Δίκαιο',
        description: 'Υποθέσεις που αφορούν συμβάσεις και αδικοπραξίες',
        subcategories: [
          {
            id: 'contracts',
            name: 'Συμβάσεις',
            description: 'Υποθέσεις σχετικά με συμβάσεις και συμφωνίες'
          },
          {
            id: 'torts',
            name: 'Αδικοπραξίες',
            description: 'Υποθέσεις αδικοπραξιών και αδικημάτων'
          }
        ]
      }
    ]
  },
  {
    id: 'commercial',
    name: 'Εμπορικό Δίκαιο',
    description: 'Υποθέσεις που αφορούν εμπορικές και επιχειρηματικές δραστηριότητες',
    subcategories: [
      {
        id: 'corporate',
        name: 'Εταιρικό Δίκαιο',
        description: 'Υποθέσεις που αφορούν εταιρείες και επιχειρήσεις',
        subcategories: [
          {
            id: 'company_formation',
            name: 'Συστάσεις εταιρειών',
            description: 'Διαδικασίες ίδρυσης και λειτουργίας εταιρειών'
          },
          {
            id: 'corporate_disputes',
            name: 'Εταιρικές διαφορές',
            description: 'Διαφορές μεταξύ εταίρων και μετόχων'
          }
        ]
      },
      {
        id: 'bankruptcy',
        name: 'Πτωχευτικό Δίκαιο',
        description: 'Υποθέσεις πτώχευσης και εκκαθάρισης'
      },
      {
        id: 'banking',
        name: 'Τραπεζικό Δίκαιο',
        description: 'Υποθέσεις που αφορούν τραπεζικές συναλλαγές'
      }
    ]
  },
  {
    id: 'labor',
    name: 'Εργατικό Δίκαιο',
    description: 'Υποθέσεις που αφορούν εργασιακές σχέσεις',
    subcategories: [
      {
        id: 'labor_disputes',
        name: 'Εργατικές διαφορές',
        description: 'Διαφορές μεταξύ εργοδότων και εργαζομένων'
      },
      {
        id: 'dismissals',
        name: 'Απολύσεις',
        description: 'Υποθέσεις σχετικά με απολύσεις και καταγγελίες'
      },
      {
        id: 'work_accidents',
        name: 'Εργατικά ατυχήματα',
        description: 'Υποθέσεις σχετικά με εργατικά ατυχήματα',
        relatedCategories: ['criminal'] // Συνδέεται με ποινικό δίκαιο
      }
    ]
  },
  {
    id: 'criminal',
    name: 'Ποινικό Δίκαιο',
    description: 'Υποθέσεις που αφορούν ποινικές πράξεις',
    subcategories: [
      {
        id: 'misdemeanors',
        name: 'Πλημμελήματα',
        description: 'Υποθέσεις πλημμελημάτων'
      },
      {
        id: 'felonies',
        name: 'Κακουργήματα',
        description: 'Υποθέσεις κακουργημάτων'
      },
      {
        id: 'traffic',
        name: 'Τροχαία',
        description: 'Υποθέσεις τροχαίων ατυχημάτων'
      }
    ]
  },
  {
    id: 'administrative',
    name: 'Διοικητικό Δίκαιο',
    description: 'Υποθέσεις που αφορούν διοικητικές αρχές',
    subcategories: [
      {
        id: 'tax',
        name: 'Φορολογικές υποθέσεις',
        description: 'Υποθέσεις σχετικά με φόρους και εισφορές',
        relatedCategories: ['commercial'] // Συνδέεται με εμπορικό δίκαιο
      },
      {
        id: 'administrative_disputes',
        name: 'Διοικητικές διαφορές',
        description: 'Διαφορές με διοικητικές αρχές'
      },
      {
        id: 'urban_planning',
        name: 'Πολεοδομικές υποθέσεις',
        description: 'Υποθέσεις σχετικά με πολεοδομικά θέματα'
      }
    ]
  }
];

// Βοηθητική συνάρτηση για την εύρεση κατηγορίας με βάση το ID
export function findCategoryById(id: string, categoriesList: Category[] = categories): Category | null {
  for (const category of categoriesList) {
    if (category.id === id) return category;
    if (category.subcategories) {
      const found = findCategoryById(id, category.subcategories);
      if (found) return found;
    }
  }
  return null;
}

// Βοηθητική συνάρτηση για την εύρεση σχετικών κατηγοριών
export function findRelatedCategories(categoryId: string): Category[] {
  const category = findCategoryById(categoryId);
  if (!category?.relatedCategories) return [];
  
  return category.relatedCategories
    .map(id => findCategoryById(id))
    .filter((cat): cat is Category => cat !== null);
}

// Προσθήκη default export
export default categories; 