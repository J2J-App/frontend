/**
 * Main entry point for autocomplete utilities
 * Exports all core functionality for university autocomplete
 */

// Types
export type { UniversitySuggestion, CollegeSequence, RankingOptions } from './types';

// Data processing
export {
  processCollegeData,
  getAllUniversities,
  getUniversitiesForCounselling,
  getUniversitiesByType
} from './data-processor';

// Ranking and filtering
export {
  calculateScore,
  rankSuggestions,
  filterAndRankSuggestions,
  getTopSuggestion,
  rankSuggestionsByType
} from './ranking';

// Text utilities
export {
  normalizeText,
  isExactPrefixMatch,
  isPartialMatch,
  isWordPrefixMatch,
  getMatchScore,
  filterByQuery,
  highlightMatches
} from './text-utils';

// Display names
export { getDisplayName, UNIVERSITY_DISPLAY_NAMES } from './display-names';