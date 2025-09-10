/**
 * Suggestion ranking algorithm with probability-based scoring and alphabetical fallback
 */

import { UniversitySuggestion, RankingOptions } from './types';
import { getMatchScore, normalizeText } from './text-utils';

/**
 * Calculate ranking score for a suggestion based on query
 */
export function calculateScore(suggestion: UniversitySuggestion, query: string): number {
  if (!query) return 0;
  
  // Base match score from text matching
  const textScore = getMatchScore(suggestion.displayName, query);
  
  // Probability bonus (0-100 range expected)
  const probabilityScore = suggestion.probability || 0;
  
  // Combine scores with appropriate weights
  // Text match is primary (0-1000), probability is secondary (0-100)
  return textScore + probabilityScore;
}

/**
 * Rank suggestions by relevance to query
 */
export function rankSuggestions(
  suggestions: UniversitySuggestion[],
  query: string,
  options: RankingOptions = {}
): UniversitySuggestion[] {
  const {
    maxResults = 10,
    prioritizeExactMatch = true,
    caseSensitive = false
  } = options;
  
  if (!query) {
    // No query - return alphabetically sorted suggestions
    return suggestions
      .slice()
      .sort((a, b) => a.displayName.localeCompare(b.displayName))
      .slice(0, maxResults);
  }
  
  // Filter suggestions that match the query
  const matchingSuggestions = suggestions.filter(suggestion => {
    const text = caseSensitive ? suggestion.displayName : normalizeText(suggestion.displayName);
    const searchQuery = caseSensitive ? query : normalizeText(query);
    return text.includes(searchQuery);
  });
  
  // Calculate scores and sort
  const scoredSuggestions = matchingSuggestions.map(suggestion => ({
    suggestion,
    score: calculateScore(suggestion, query)
  }));
  
  // Sort by score (descending), then alphabetically for ties
  scoredSuggestions.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score; // Higher score first
    }
    return a.suggestion.displayName.localeCompare(b.suggestion.displayName);
  });
  
  return scoredSuggestions
    .slice(0, maxResults)
    .map(item => item.suggestion);
}

/**
 * Filter and rank suggestions in one step
 */
export function filterAndRankSuggestions(
  suggestions: UniversitySuggestion[],
  query: string,
  options: RankingOptions = {}
): UniversitySuggestion[] {
  return rankSuggestions(suggestions, query, options);
}

/**
 * Get top suggestion for a query
 */
export function getTopSuggestion(
  suggestions: UniversitySuggestion[],
  query: string
): UniversitySuggestion | null {
  const ranked = rankSuggestions(suggestions, query, { maxResults: 1 });
  return ranked.length > 0 ? ranked[0] : null;
}

/**
 * Group suggestions by type and rank within each group
 */
export function rankSuggestionsByType(
  suggestions: UniversitySuggestion[],
  query: string,
  options: RankingOptions = {}
): Record<string, UniversitySuggestion[]> {
  const grouped: Record<string, UniversitySuggestion[]> = {};
  
  // Group by type
  suggestions.forEach(suggestion => {
    if (!grouped[suggestion.type]) {
      grouped[suggestion.type] = [];
    }
    grouped[suggestion.type].push(suggestion);
  });
  
  // Rank within each group
  Object.keys(grouped).forEach(type => {
    grouped[type] = rankSuggestions(grouped[type], query, options);
  });
  
  return grouped;
}