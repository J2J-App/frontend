/**
 * Text matching and filtering utilities for autocomplete functionality
 */

/**
 * Normalize text for consistent matching
 */
export function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Check if text starts with query (prefix match)
 */
export function isExactPrefixMatch(text: string, query: string): boolean {
  if (!query) return false;
  return normalizeText(text).startsWith(normalizeText(query));
}

/**
 * Check if text contains query (partial match)
 */
export function isPartialMatch(text: string, query: string): boolean {
  if (!query) return false;
  return normalizeText(text).includes(normalizeText(query));
}

/**
 * Check if any word in text starts with query
 */
export function isWordPrefixMatch(text: string, query: string): boolean {
  if (!query) return false;
  const normalizedQuery = normalizeText(query);
  const words = normalizeText(text).split(/\s+/);
  return words.some(word => word.startsWith(normalizedQuery));
}

/**
 * Get match score for ranking purposes
 * Higher score = better match
 */
export function getMatchScore(text: string, query: string): number {
  if (!query) return 0;
  
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  
  // Exact match gets highest score
  if (normalizedText === normalizedQuery) return 1000;
  
  // Exact prefix match gets high score
  if (normalizedText.startsWith(normalizedQuery)) return 800;
  
  // Word prefix match gets medium-high score
  if (isWordPrefixMatch(text, query)) return 600;
  
  // Partial match gets lower score
  if (normalizedText.includes(normalizedQuery)) return 400;
  
  // No match
  return 0;
}

/**
 * Filter text array by query with different match types
 */
export function filterByQuery<T>(
  items: T[],
  query: string,
  getText: (item: T) => string,
  options: {
    exactPrefixOnly?: boolean;
    includePartialMatches?: boolean;
  } = {}
): T[] {
  if (!query) return items;
  
  const { exactPrefixOnly = false, includePartialMatches = true } = options;
  
  return items.filter(item => {
    const text = getText(item);
    
    if (exactPrefixOnly) {
      return isExactPrefixMatch(text, query);
    }
    
    if (includePartialMatches) {
      return isPartialMatch(text, query);
    }
    
    return isExactPrefixMatch(text, query) || isWordPrefixMatch(text, query);
  });
}

/**
 * Highlight matching parts of text for display
 */
export function highlightMatches(text: string, query: string): string {
  if (!query) return text;
  
  const normalizedQuery = normalizeText(query);
  const regex = new RegExp(`(${normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  
  return text.replace(regex, '<mark>$1</mark>');
}