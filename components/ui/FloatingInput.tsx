'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFormStore } from '@/lib/store';

interface FloatingInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const FloatingInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder = '',
  required = false,
  icon,
}: FloatingInputProps) => {
  const { theme } = useFormStore();
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        {icon && (
          <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${
            isFocused || hasValue ? 'opacity-70' : 'opacity-40'
          }`}>
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? placeholder : ''}
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
            px-2 rounded-md transition-colors duration-200
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
      </div>

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
