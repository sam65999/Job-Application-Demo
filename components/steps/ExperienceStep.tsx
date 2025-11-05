'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { useState } from 'react';

export const ExperienceStep = () => {
  const { formData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.hasExperience && !formData.yearsOfExperience.trim()) {
      newErrors.yearsOfExperience = 'Please select your experience level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validateExperience?: () => boolean }).__validateExperience = validate;
  }

  const experienceOptions = [
    { value: '0-1', label: '0-1 years (Fresh graduate)' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5-10', label: '5-10 years' },
    { value: '10+', label: '10+ years' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Have Experience Toggle */}
      <div className="space-y-3">
        <p
          className="block text-sm font-medium transition-colors text-gray-200"
        >
          Do you have prior work experience?
        </p>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateFormData({ hasExperience: true })}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              formData.hasExperience
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            Yes
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateFormData({ hasExperience: false })}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
              !formData.hasExperience
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            No
          </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {formData.hasExperience && (
          <motion.div
            key="experience-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Current Role */}
            <div className="space-y-2">
              <label
                htmlFor="currentRole"
                className="block text-sm font-medium transition-colors text-gray-200"
              >
                Current/Most Recent Role
              </label>
              <input
                id="currentRole"
                type="text"
                placeholder="e.g., Senior Product Designer"
                value={formData.currentRole}
                onChange={(e) => updateFormData({ currentRole: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-3">
              <label
                className="block text-sm font-medium transition-colors text-gray-200"
              >
                Years of Experience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {experienceOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateFormData({ yearsOfExperience: option.value })}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
                      formData.yearsOfExperience === option.value
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-gray-700 border-gray-600 text-gray-300'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              {errors.yearsOfExperience && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500"
                >
                  {errors.yearsOfExperience}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Availability */}
      <div className="space-y-3">
        <label
          className="block text-sm font-medium transition-colors text-gray-200"
        >
          When can you start?
        </label>
        <div className="space-y-2">
          {[
            { value: 'immediately', label: 'Immediately' },
            { value: '2weeks', label: 'Within 2 weeks' },
            { value: '1month', label: 'Within 1 month' },
            { value: 'flexible', label: 'Flexible' },
          ].map((option) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => updateFormData({ availability: option.value })}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                formData.availability === option.value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-700 border-gray-600 text-gray-300'
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-3 rounded-lg bg-blue-900/20 border border-blue-800 text-blue-300"
      >
        <p className="text-sm">
          ✓ This helps us match you with the right opportunities.
        </p>
      </motion.div>
    </motion.div>
  );
};
