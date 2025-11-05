import { useState, useEffect, useCallback } from 'react';

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}

export const useLocationAutocomplete = (apiKey: string = '') => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // LocationIQ Autocomplete API endpoint
      const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=us&format=json`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // Debounce delay

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    error,
    clearSuggestions: () => setSuggestions([])
  };
};
