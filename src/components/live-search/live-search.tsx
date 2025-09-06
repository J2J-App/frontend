import React, { useState, useEffect, useCallback } from 'react';
import styles from './live-search.module.css';

interface Suggestion {
  name: string;
}

const LiveSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestions = async (searchQuery: string): Promise<Suggestion[]> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (searchQuery.toLowerCase().includes('error')) {
      throw new Error('Failed to fetch suggestions');
    }
    const allColleges = [
      { name: 'Indian Institute of Technology Bombay' },
      { name: 'Indian Institute of Technology Delhi' },
      { name: 'Indian Institute of Technology Madras' },
      { name: 'Indian Institute of Technology Kanpur' },
      { name: 'Indian Institute of Technology Kharagpur' },
    ];
    return allColleges.filter((college) =>
      college.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await getSuggestions(searchQuery);
        setSuggestions(result);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  return (
    <div className={styles.liveSearchContainer}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for colleges..."
        className={styles.searchInput}
        aria-label="Search for colleges"
        aria-autocomplete="list"
      />
      {loading && <div className={styles.loadingIndicator}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      {suggestions.length > 0 && (
        <ul className={styles.suggestionsList} role="listbox">
          {suggestions.map((suggestion, index) => (
            <li key={index} role="option" aria-selected="false">
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LiveSearch;
