import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={48} color="#a0aec0" />
      <Text style={styles.emptyStateTitle}>Καμία υπόθεση</Text>
      <Text style={styles.emptyStateDescription}>
        {searchTerm 
          ? "Δεν βρέθηκαν υποθέσεις που να ταιριάζουν με την αναζήτησή σας." 
          : "Δεν έχετε αποθηκεύσει καμία υπόθεση ακόμα."}
      </Text>
      {!searchTerm && (
        <Link href="/new-case" asChild>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>Δημιουργία υπόθεσης</Text>
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );

  const renderCaseItem = ({ item }: { item: CaseHistoryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.cardCategory}>{item.category}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#64748b" />
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
      </View>
      
      <View style={styles.cardFooter}>
        <Link href={`/case/${item.id}`} asChild>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>Προβολή</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons 
            name="search" 
            size={16} 
            color="#64748b" 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Αναζήτηση υποθέσεων..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setSortDesc(!sortDesc)}
        >
          <Ionicons name="swap-vertical" size={16} color="#1a365d" />
          <Text style={styles.sortButtonText}>
            {sortDesc ? "Νεότερα πρώτα" : "Παλαιότερα πρώτα"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedCases}
        renderItem={renderCaseItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    gap: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  sortButtonText: {
    fontSize: 14,
    color: '#1a365d',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a365d',
  },
  cardCategory: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
  },
  cardContent: {
    padding: 16,
  },
  summary: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewButtonText: {
    fontSize: 14,
    color: '#1a365d',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a365d',
    marginTop: 16,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  createButton: {
    backgroundColor: '#1a365d',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HistoryList; 