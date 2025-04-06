import { useMemo } from 'react';

interface ProbabilityColors {
  textColor: string;
  backgroundColor: string;
}

export const useProbabilityColors = (probability: number): ProbabilityColors => {
  return useMemo(() => {
    if (probability >= 70) {
      return {
        textColor: '#16a34a',
        backgroundColor: '#f0fdf4',
      };
    }
    if (probability >= 40) {
      return {
        textColor: '#d97706',
        backgroundColor: '#fffbeb',
      };
    }
    return {
      textColor: '#dc2626',
      backgroundColor: '#fef2f2',
    };
  }, [probability]);
}; 