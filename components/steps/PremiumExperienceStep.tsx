'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { BriefcaseIcon, BuildingIcon, ClockIcon, HomeOfficeIcon } from '@/components/ui/Icons';
import { useState } from 'react';

export const ExperienceStep = () => {
  const { formData, updateFormData, theme } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (formData.hasExperience) {
      if (formData.currentRole && formData.currentRole.trim().length < 2) {
        newErrors.currentRole = 'Please enter a valid role';
      }
      
      if (formData.company && formData.company.trim().length < 2) {
        newErrors.company = 'Please enter a valid company name';
      }
      
      if (!formData.yearsOfExperience) {
        newErrors.yearsOfExperience = 'Please select your experience level';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validateExperience?: () => boolean }).__validateExperience = validate;
  }

  const experienceOptions = [
    { value: '0-1', label: 'Entry Level', subtitle: '0-1 years' },
    { value: '1-3', label: 'Junior', subtitle: '1-3 years' },
    { value: '3-5', label: 'Mid-Level', subtitle: '3-5 years' },
    { value: '5-10', label: 'Senior', subtitle: '5-10 years' },
    { value: '10+', label: 'Expert', subtitle: '10+ years' },
  ];

  const availabilityOptions = [
    { value: 'immediately', label: 'Immediately', icon: '⚡' },
    { value: '2weeks', label: 'Within 2 weeks', icon: '📅' },
    { value: '1month', label: 'Within 1 month', icon: '🗓️' },
    { value: 'flexible', label: 'Flexible', icon: '🔄' },
  ];

  const remoteOptions = [
    { value: 'remote', label: 'Remote', icon: '🏠' },
    { value: 'hybrid', label: 'Hybrid', icon: '🔀' },
    { value: 'onsite', label: 'On-site', icon: '🏢' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-3xl sm:text-4xl font-bold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Tell us about your experience
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Help us understand your professional background
        </motion.p>
      </div>

      {/* Experience Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <label className={`block text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Do you have prior work experience?
        </label>
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateFormData({ hasExperience: true })}
            className={`
              px-6 py-4 rounded-xl font-semibold transition-all border-2
              ${formData.hasExperience
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                : theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }
            `}
          >
            Yes, I do
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => updateFormData({ hasExperience: false, currentRole: '', company: '', yearsOfExperience: '' })}
            className={`
              px-6 py-4 rounded-xl font-semibold transition-all border-2
              ${!formData.hasExperience
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/30'
                : theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
                  : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
              }
            `}
          >
            No, I&apos;m new
          </motion.button>
        </div>
      </motion.div>

      {/* Conditional Experience Fields */}
      <AnimatePresence mode="wait">
        {formData.hasExperience && (
          <motion.div
            key="experience-fields"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {/* Current Role */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <FloatingInput
                id="currentRole"
                label="Current / Most Recent Role"
                value={formData.currentRole}
                onChange={(value) => {
                  updateFormData({ currentRole: value });
                  setErrors({ ...errors, currentRole: '' });
                }}
                error={errors.currentRole}
                placeholder="e.g., Senior Product Designer"
                icon={<BriefcaseIcon />}
              />
            </motion.div>

            {/* Company */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <FloatingInput
                id="company"
                label="Company Name"
                value={formData.company}
                onChange={(value) => {
                  updateFormData({ company: value });
                  setErrors({ ...errors, company: '' });
                }}
                error={errors.company}
                placeholder="e.g., Tech Corp Inc."
                icon={<BuildingIcon />}
              />
            </motion.div>

            {/* Years of Experience */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <label className={`block text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Years of Experience
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {experienceOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    onClick={() => {
                      updateFormData({ yearsOfExperience: option.value });
                      setErrors({ ...errors, yearsOfExperience: '' });
                    }}
                    className={`
                      p-4 rounded-xl text-left transition-all border-2
                      ${formData.yearsOfExperience === option.value
                        ? theme === 'dark'
                          ? 'bg-blue-900/30 border-blue-500 text-blue-300'
                          : 'bg-blue-100 border-blue-500 text-blue-700'
                        : theme === 'dark'
                          ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                      }
                    `}
                  >
                    <div className="font-semibold text-sm">{option.label}</div>
                    <div className={`text-xs mt-1 ${
                      formData.yearsOfExperience === option.value
                        ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        : theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {option.subtitle}
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.yearsOfExperience && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-500 ml-1"
                >
                  {errors.yearsOfExperience}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Availability */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <label className={`flex items-center gap-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <ClockIcon />
          When can you start?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {availabilityOptions.map((option, index) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.05 }}
              onClick={() => updateFormData({ availability: option.value })}
              className={`
                p-4 rounded-xl text-center transition-all border-2
                ${formData.availability === option.value
                  ? theme === 'dark'
                    ? 'bg-green-900/30 border-green-500 text-green-300'
                    : 'bg-green-100 border-green-500 text-green-700'
                  : theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Work Preference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <label className={`flex items-center gap-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <HomeOfficeIcon />
          Work Preference
        </label>
        <div className="grid grid-cols-3 gap-3">
          {remoteOptions.map((option, index) => (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              onClick={() => updateFormData({ remote: option.value })}
              className={`
                p-4 rounded-xl text-center transition-all border-2
                ${formData.remote === option.value
                  ? theme === 'dark'
                    ? 'bg-purple-900/30 border-purple-500 text-purple-300'
                    : 'bg-purple-100 border-purple-500 text-purple-700'
                  : theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500'
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <div className="text-2xl mb-1">{option.icon}</div>
              <div className="text-xs font-medium">{option.label}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`
          flex gap-3 p-4 rounded-xl border
          ${
            theme === 'dark'
              ? 'bg-gray-800/30 border-gray-700/50'
              : 'bg-gray-50 border-gray-200'
          }
        `}
      >
        <svg className={`w-5 h-5 flex-shrink-0 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <p className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
        }`}>
          Don&apos;t worry if you&apos;re just starting out—we value potential and eagerness to learn just as much as experience.
        </p>
      </motion.div>
    </motion.div>
  );
};
