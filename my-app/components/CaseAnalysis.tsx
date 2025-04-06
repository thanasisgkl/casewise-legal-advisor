import React, { useState, useEffect } from 'react';
import { api, LegalAnalysis, CaseData } from '../services/api';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

interface CaseAnalysisProps {
  caseData: CaseData;
}

export const CaseAnalysis: React.FC<CaseAnalysisProps> = ({ caseData }) => {
  const [analysis, setAnalysis] = useState<LegalAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        console.log('======= CASE ANALYSIS COMPONENT =======');
        console.log('CaseData received:', {
          descriptionLength: caseData.description?.length || 0,
          title: caseData.title,
          category: caseData.category
        });
        
        if (!caseData.description) {
          console.log('Error: No description available');
          setError('Δεν υπάρχει κείμενο για ανάλυση.');
          return;
        }
        
        setLoading(true);
        console.log('Calling API.analyzeCase with description length:', caseData.description.length);
        const result = await api.analyzeCase(caseData);
        console.log('API response received:', {
          type: typeof result,
          keys: result ? Object.keys(result) : 'null',
          summaryLength: result?.summary?.length || 0
        });
        
        setAnalysis(result);
        console.log('Analysis state updated');
        setError(null);
      } catch (err) {
        console.error('Error in CaseAnalysis component:', err);
        setError('Σφάλμα κατά την ανάλυση της υπόθεσης. Παρακαλώ δοκιμάστε ξανά.');
        console.error('Error analyzing case:', err);
      } finally {
        setLoading(false);
        console.log('Loading state set to false');
        console.log('=========================================');
      }
    };

    fetchAnalysis();
  }, [caseData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2 }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Περίληψη</Typography>
      <Typography paragraph>{analysis.summary}</Typography>

      <Typography variant="h5" gutterBottom>Λεπτομέρειες</Typography>
      <Typography paragraph>{analysis.details}</Typography>

      <Typography variant="h5" gutterBottom>Προτάσεις</Typography>
      <List>
        {analysis.recommendations.map((recommendation) => (
          <ListItem key={`recommendation-${recommendation.substring(0, 20)}`}>
            <ListItemText primary={recommendation} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>Πιθανά Αποτελέσματα</Typography>
      <List>
        {analysis.outcomes.map((outcome) => (
          <ListItem key={outcome.id}>
            <ListItemText
              primary={outcome.scenario}
              secondary={`Πιθανότητα: ${(outcome.probability * 100).toFixed(1)}% - ${outcome.reasoning}`}
            />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" gutterBottom>Σχετικές Αναφορές</Typography>
      <List>
        {analysis.references.map((reference) => (
          <ListItem key={reference.id}>
            <ListItemText
              primary={reference.title}
              secondary={reference.description}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}; 