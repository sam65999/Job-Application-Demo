'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { LocationAutocompleteInput } from '@/components/ui/LocationAutocompleteInput';
import { LocationIcon, LinkedInIcon, GlobeIcon } from '@/components/ui/Icons';
import { useState } from 'react';

export const ContactStep = () => {
  const { formData, updateFormData, theme } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      newErrors.location = 'Please enter a valid location';
    }

    // Optional LinkedIn validation
    if (formData.linkedIn && formData.linkedIn.trim()) {
      if (!formData.linkedIn.includes('linkedin.com') && !formData.linkedIn.includes('in/')) {
        newErrors.linkedIn = 'Please enter a valid LinkedIn URL';
      }
    }

    // Optional portfolio validation
    if (formData.portfolio && formData.portfolio.trim()) {
      if (!/^https?:\/\/.+\..+/.test(formData.portfolio)) {
        newErrors.portfolio = 'Please enter a valid URL (include http:// or https://)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validateContact?: () => boolean }).__validateContact = validate;
  }

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
          Where can we reach you?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Share your location and professional profiles
        </motion.p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <LocationAutocompleteInput
            id="location"
            label="City, State or Remote"
            value={formData.location}
            onChange={(value) => {
              updateFormData({ location: value });
              setErrors({ ...errors, location: '' });
            }}
            error={errors.location}
            placeholder="San Francisco, CA"
            required
            icon={<LocationIcon />}
          />
        </motion.div>

        {/* Professional Links Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className={`flex items-center gap-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="font-semibold">Professional Links</h3>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
            }`}>(Optional)</span>
          </div>

          {/* LinkedIn */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <FloatingInput
              id="linkedIn"
              label="LinkedIn Profile"
              value={formData.linkedIn}
              onChange={(value) => {
                updateFormData({ linkedIn: value });
                setErrors({ ...errors, linkedIn: '' });
              }}
              error={errors.linkedIn}
              placeholder="linkedin.com/in/yourprofile"
              icon={<LinkedInIcon />}
            />
          </motion.div>

          {/* Portfolio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <FloatingInput
              id="portfolio"
              label="Portfolio / Website"
              value={formData.portfolio}
              onChange={(value) => {
                updateFormData({ portfolio: value });
                setErrors({ ...errors, portfolio: '' });
              }}
              error={errors.portfolio}
              placeholder="https://yourwebsite.com"
              icon={<GlobeIcon />}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Info Cards */}
      <div className="space-y-4">
        {/* Professional Presence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            flex gap-3 p-4 rounded-xl border
            ${
              theme === 'dark'
                ? 'bg-blue-900/20 border-blue-500/30'
                : 'bg-blue-50 border-blue-200'
            }
          `}
        >
          <svg className={`w-5 h-5 flex-shrink-0 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
          </svg>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Boost your profile visibility
            </p>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-blue-300/80' : 'text-blue-600'
            }`}>
              Adding your LinkedIn or portfolio can increase your chances by 40%
            </p>
          </div>
        </motion.div>

        {/* Remote Work */}
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
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
          }`}>
            We&apos;ll consider your location for remote, hybrid, or on-site opportunities
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
