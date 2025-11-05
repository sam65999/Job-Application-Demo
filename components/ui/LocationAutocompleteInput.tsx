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

interface LocationAutocompleteInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  apiKey?: string;
}

export const LocationAutocompleteInput = ({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  icon,
  apiKey = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || '',
}: LocationAutocompleteInputProps) => {
  const { theme } = useFormStore();
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasValue = value.length > 0;

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
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 z-10 ${
            isFocused || hasValue ? 'opacity-70' : 'opacity-40'
          }`}>
            {icon}
          </div>
        )}

        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            if (value.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
          autoComplete="off"
          className={`
            peer w-full px-4 ${icon ? 'pl-12' : 'pl-4'} py-4 rounded-xl
            border-2 transition-all duration-300
            backdrop-blur-sm
            ${theme === 'dark'
              ? 'bg-gray-800/50 text-white placeholder:text-gray-400'
              : 'bg-white/80 text-gray-900 placeholder:text-gray-500'
            }
            ${error
              ? theme === 'dark' ? 'border-red-500/50' : 'border-red-500'
              : isFocused
              ? theme === 'dark'
                ? 'border-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'border-blue-500 shadow-lg shadow-blue-500/20'
              : theme === 'dark'
                ? 'border-gray-700/50 hover:border-gray-600/50'
                : 'border-gray-300 hover:border-gray-400'
            }
            focus:outline-none focus:ring-0
          `}
        />

        <motion.label
          htmlFor={id}
          initial={false}
          animate={{
            top: isFocused || hasValue ? '0' : '50%',
            translateY: isFocused || hasValue ? '-50%' : '-50%',
            scale: isFocused || hasValue ? 0.85 : 1,
            translateX: isFocused || hasValue ? (icon ? '3rem' : '1rem') : (icon ? '3rem' : '1rem'),
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`
            absolute left-0 pointer-events-none origin-left
            px-2 rounded-md transition-colors duration-200 z-10
            ${isFocused || hasValue
              ? theme === 'dark'
                ? 'bg-gray-900 text-blue-400 font-medium'
                : 'bg-white text-blue-600 font-medium'
              : theme === 'dark'
                ? 'text-gray-400 font-normal'
                : 'text-gray-600 font-normal'
            }
          `}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>

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
              absolute z-50 w-full mt-2 rounded-xl border shadow-xl overflow-hidden
              ${theme === 'dark'
                ? 'bg-gray-800/95 border-gray-700 backdrop-blur-xl'
                : 'bg-white border-gray-200 backdrop-blur-xl'
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
                    w-full px-4 py-3 text-left transition-colors
                    flex items-center gap-3
                    ${theme === 'dark'
                      ? 'hover:bg-gray-700/70 text-gray-200'
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
                  <span className="text-sm truncate">{displayText}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-red-500 mt-2 ml-1 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}
    </div>
  );
};
