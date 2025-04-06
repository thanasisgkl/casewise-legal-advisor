import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '../ui/Card';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const filteredCases = cases.filter(
    (caseItem) =>
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
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons
            name="search"
            size={16}
            color="#64748b"
            style={styles.searchIcon}
          />
          <Input
            placeholder="Αναζήτηση υποθέσεων..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={styles.searchInput}
          />
        </View>
        <Button
          variant="outline"
          onPress={() => setSortDesc(!sortDesc)}
          style={styles.sortButton}
        >
          <Ionicons
            name="swap-vertical"
            size={16}
            color="#1a365d"
            style={styles.sortIcon}
          />
          Ταξινόμηση: {sortDesc ? 'Νεότερα πρώτα' : 'Παλαιότερα πρώτα'}
        </Button>
      </View>

      {sortedCases.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="document-text" size={48} color="#94a3b8" />
          <Text style={styles.emptyStateTitle}>Καμία υπόθεση</Text>
          <Text style={styles.emptyStateText}>
            {searchTerm
              ? 'Δεν βρέθηκαν υποθέσεις που να ταιριάζουν με την αναζήτησή σας.'
              : 'Δεν έχετε αποθηκεύσει καμία υπόθεση ακόμα.'}
          </Text>
          {!searchTerm && (
            <Button
              variant="default"
              onPress={() => router.push('/new-case')}
              style={styles.createButton}
            >
              Δημιουργία υπόθεσης
            </Button>
          )}
        </View>
      ) : (
        <ScrollView style={styles.casesContainer}>
          <View style={[styles.casesGrid, isTablet && styles.tabletGrid]}>
            {sortedCases.map((caseItem) => (
              <TouchableOpacity
                key={caseItem.id}
                onPress={() => router.push(`/case/${caseItem.id}`)}
              >
                <Card style={styles.caseCard}>
                  <CardHeader>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitle} numberOfLines={1}>
                          {caseItem.title}
                        </Text>
                        <CardDescription>{caseItem.category}</CardDescription>
                      </View>
                      <View style={styles.dateContainer}>
                        <Ionicons
                          name="calendar"
                          size={16}
                          color="#64748b"
                          style={styles.dateIcon}
                        />
                        <Text style={styles.dateText}>{caseItem.date}</Text>
                      </View>
                    </View>
                  </CardHeader>
                  <CardContent>
                    <Text style={styles.summaryText} numberOfLines={2}>
                      {caseItem.summary}
                    </Text>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      size="sm"
                      style={styles.viewButton}
                    >
                      Προβολή
                    </Button>
                  </CardFooter>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 36,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortIcon: {
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a365d',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  createButton: {
    marginTop: 16,
  },
  casesContainer: {
    flex: 1,
  },
  casesGrid: {
    gap: 16,
  },
  tabletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caseCard: {
    flex: 1,
    minWidth: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryText: {
    fontSize: 14,
    color: '#64748b',
  },
  viewButton: {
    marginLeft: 'auto',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a365d',
  },
});

export default HistoryList; 