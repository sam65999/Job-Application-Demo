'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useFormStore } from '@/lib/store';

interface LocationSuggestion {
  display_name: string;
  place_id: string;
  address?: {
    name?: string;
    city?: string;
    state?: string;
    county?: string;
    country?: string;
  };
}

interface SimpleLocationAutocompleteProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  apiKey?: string;
}

export const SimpleLocationAutocomplete = ({
  id,
  value,
  onChange,
  placeholder = '',
  className = '',
  apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || '',
}: SimpleLocationAutocompleteProps) => {
  const { theme } = useFormStore();
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2 || !apiKey) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const url = `https://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=us&format=json`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Location autocomplete error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (newValue: string) => {
    onChange(newValue);

    // Debounce API calls
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    let locationText = '';

    // Try to use address object first (most reliable)
    if (suggestion.address) {
      const city = suggestion.address.city || suggestion.address.name;
      const state = suggestion.address.state;
      
      if (city && state) {
        locationText = `${city}, ${state}`;
      } else if (city) {
        locationText = city;
      }
    }

    // Fallback: Parse display_name to extract city and state (avoid ZIP codes)
    if (!locationText) {
      const parts = suggestion.display_name.split(',').map(p => p.trim());
      
      // Filter out parts that look like ZIP codes (5 digits) or countries
      const filteredParts = parts.filter(part => 
        !/^\d{5}(-\d{4})?$/.test(part) && // Not a ZIP code
        part.toLowerCase() !== 'united states' &&
        part.toLowerCase() !== 'usa'
      );

      // Try to get city (first part) and state (usually second or last)
      if (filteredParts.length >= 2) {
        // Check if second part is a 2-letter state code or state name
        const possibleState = filteredParts[1];
        if (possibleState.length === 2 || possibleState.length > 2) {
          locationText = `${filteredParts[0]}, ${possibleState}`;
        } else {
          locationText = `${filteredParts[0]}, ${filteredParts[filteredParts.length - 1]}`;
        }
      } else if (filteredParts.length === 1) {
        locationText = filteredParts[0];
      } else {
        locationText = suggestion.display_name;
      }
    }

    onChange(locationText);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            if (value.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={className}
        />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <svg className={`w-5 h-5 animate-spin ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`
              absolute z-50 w-full mt-2 rounded-lg border shadow-xl overflow-hidden max-h-60 overflow-y-auto
              ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
              }
            `}
          >
            {suggestions.map((suggestion, index) => {
              // Format display text for dropdown
              let displayText = suggestion.display_name;
              if (suggestion.address) {
                const city = suggestion.address.city || suggestion.address.name;
                const state = suggestion.address.state;
                if (city && state) {
                  displayText = `${city}, ${state}`;
                }
              }

              return (
                <button
                  key={`${suggestion.place_id}-${index}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(suggestion);
                  }}
                  className={`
                    w-full px-4 py-3 text-left text-sm transition-colors
                    flex items-center gap-2
                    ${theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-200'
                      : 'hover:bg-blue-50 text-gray-800'
                    }
                  `}
                >
                  <svg className={`w-4 h-4 flex-shrink-0 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{displayText}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
