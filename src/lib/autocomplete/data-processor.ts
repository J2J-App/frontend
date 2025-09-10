/**
 * University data processor to convert collegeSequence data into searchable suggestions
 */

import { UniversitySuggestion, CollegeSequence } from './types';
import { getDisplayName } from './display-names';

/**
 * Process college sequence data into university suggestions
 */
export function processCollegeData(
  collegeSequence: CollegeSequence,
  counselling: string
): UniversitySuggestion[] {
  const suggestions: UniversitySuggestion[] = [];
  const counsellingData = collegeSequence[counselling];
  
  if (!counsellingData) {
    return suggestions;
  }
  
  // Handle flat array structure (like JAC)
  if (Array.isArray(counsellingData)) {
    counsellingData.forEach(slug => {
      suggestions.push(createSuggestion(slug, counselling, counselling));
    });
  } else {
    // Handle nested object structure (like JOSAA)
    Object.entries(counsellingData).forEach(([type, slugs]) => {
      if (Array.isArray(slugs)) {
        slugs.forEach(slug => {
          suggestions.push(createSuggestion(slug, type, counselling));
        });
      }
    });
  }
  
  return suggestions;
}

/**
 * Create a university suggestion from slug and type
 */
function createSuggestion(
  slug: string,
  type: string,
  counselling: string
): UniversitySuggestion {
  const displayName = getDisplayName(slug);
  
  return {
    id: `${counselling}-${slug}`,
    name: displayName,
    displayName,
    slug,
    type: type as UniversitySuggestion['type'],
    counselling,
    // Probability will be added later when available from API
    probability: undefined
  };
}

/**
 * Get all universities from college sequence data
 */
export function getAllUniversities(collegeSequence: CollegeSequence): UniversitySuggestion[] {
  const allSuggestions: UniversitySuggestion[] = [];
  
  Object.keys(collegeSequence).forEach(counselling => {
    const suggestions = processCollegeData(collegeSequence, counselling);
    allSuggestions.push(...suggestions);
  });
  
  return allSuggestions;
}

/**
 * Get universities for specific counselling
 */
export function getUniversitiesForCounselling(
  collegeSequence: CollegeSequence,
  counselling: string
): UniversitySuggestion[] {
  return processCollegeData(collegeSequence, counselling);
}

/**
 * Get universities by type within a counselling
 */
export function getUniversitiesByType(
  collegeSequence: CollegeSequence,
  counselling: string,
  type: string
): UniversitySuggestion[] {
  const counsellingData = collegeSequence[counselling];
  
  if (!counsellingData || Array.isArray(counsellingData)) {
    return [];
  }
  
  const slugs = counsellingData[type];
  if (!Array.isArray(slugs)) {
    return [];
  }
  
  return slugs.map(slug => createSuggestion(slug, type, counselling));
}