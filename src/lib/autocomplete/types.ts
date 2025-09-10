/**
 * Core types for the university autocomplete feature
 */

export interface UniversitySuggestion {
  id: string;
  name: string;
  displayName: string;
  slug: string;
  type: 'iit' | 'nit' | 'iiit' | 'gfti' | 'jac';
  probability?: number;
  counselling: string;
}

export interface CollegeSequence {
  [key: string]: string[] | {
    [key: string]: string[];
  };
}

export interface RankingOptions {
  maxResults?: number;
  prioritizeExactMatch?: boolean;
  caseSensitive?: boolean;
}