import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categories, Category, findRelatedCategories } from '../../app/categories';

interface CategorySelectProps {
  onSelect: (categories: string[]) => void;
  selectedCategories: string[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({ onSelect, selectedCategories }) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    // Βρίσκουμε τις σχετικές κατηγορίες
    const relatedCategories = findRelatedCategories(categoryId);
    const relatedIds = relatedCategories.map(cat => cat.id);

    // Προσθέτουμε τις σχετικές κατηγορίες αν δεν είναι ήδη επιλεγμένες
    const finalSelection = [...new Set([...newSelected, ...relatedIds])];
    
    onSelect(finalSelection);
  };

  const renderCategory = (category: Category, level: number = 0) => {
    const isExpanded = expandedCategories.includes(category.id);
    const hasSubcategories = category.subcategories && category.subcategories.length > 0;
    const isSelected = selectedCategories.includes(category.id);

    return (
      <View key={category.id} style={[styles.categoryContainer, { marginLeft: level * 20 }]}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            isSelected && styles.selectedCategory
          ]}
          onPress={() => handleCategorySelect(category.id)}
        >
          <View style={styles.categoryContent}>
            {hasSubcategories && (
              <TouchableOpacity
                onPress={() => toggleCategory(category.id)}
                style={styles.expandButton}
              >
                <Ionicons
                  name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            )}
            <Text style={[styles.categoryText, isSelected && styles.selectedText]}>
              {category.name}
            </Text>
          </View>
        </TouchableOpacity>
        
        {isExpanded && hasSubcategories && (
          <View style={styles.subcategories}>
            {category.subcategories?.map(subcategory => 
              renderCategory(subcategory, level + 1)
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Επιλέξτε Κατηγορίες</Text>
      <Text style={styles.subtitle}>
        Μπορείτε να επιλέξετε μέχρι 3 κατηγορίες. Οι σχετικές κατηγορίες θα προστεθούν αυτόματα.
      </Text>
      <ScrollView style={styles.categoriesList}>
        {categories.map(category => renderCategory(category))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  categoriesList: {
    maxHeight: 400,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryButton: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expandButton: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#2196f3',
    fontWeight: '500',
  },
  subcategories: {
    marginTop: 4,
  },
});

export default CategorySelect; 