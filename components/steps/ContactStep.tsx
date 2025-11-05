'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { SimpleLocationAutocomplete } from '@/components/ui/SimpleLocationAutocomplete';
import { useState } from 'react';

export const ContactStep = () => {
  const { formData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validateContact?: () => boolean }).__validateContact = validate;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="block text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
        >
          Location
        </label>
        <SimpleLocationAutocomplete
          id="location"
          placeholder="e.g., San Francisco, CA"
          value={formData.location}
          onChange={(value) => {
            updateFormData({ location: value });
            setErrors({ ...errors, location: '' });
          }}
          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        />
        {errors.location && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {errors.location}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="linkedIn"
          className="block text-sm font-medium transition-colors text-gray-700 dark:text-gray-300"
        >
          LinkedIn Profile (Optional)
        </label>
        <input
          id="linkedIn"
          type="url"
          placeholder="linkedin.com/in/yourprofile"
          value={formData.linkedIn}
          onChange={(e) => updateFormData({ linkedIn: e.target.value })}
          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700"
        />
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Help us learn more about you
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
      >
        <p className="text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">📍 Remote-friendly?</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Let us know if you&apos;re open to remote, hybrid, or in-office roles.
        </p>
      </motion.div>
    </motion.div>
  );
};
