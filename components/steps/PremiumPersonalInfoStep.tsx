'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { FloatingInput } from '@/components/ui/FloatingInput';
import { ResumeSidebarPanel } from '@/components/ResumeSidebarPanel';
import { useState } from 'react';

export const PersonalInfoStep = () => {
  const { formData, updateFormData, theme } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validatePersonalInfo?: () => boolean }).__validatePersonalInfo = validate;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 space-y-8"
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
            Let&apos;s start with the basics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={`text-lg ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Tell us who you are so we can get in touch
          </motion.p>
        </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <FloatingInput
            id="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={(value) => {
              updateFormData({ fullName: value });
              setErrors({ ...errors, fullName: '' });
            }}
            error={errors.fullName}
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FloatingInput
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(value) => {
              updateFormData({ email: value });
              setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            placeholder="your@email.com"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <FloatingInput
            id="phone"
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) => {
              updateFormData({ phone: value });
              setErrors({ ...errors, phone: '' });
            }}
            error={errors.phone}
            placeholder="+1 (555) 000-0000"
            required
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            }
          />
        </motion.div>
      </div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`flex gap-3 p-4 rounded-xl border ${
            theme === 'dark'
              ? 'bg-gray-800/30 border-gray-700/50'
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <svg className={`w-5 h-5 flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
          }`}>
            Your information is secure and will only be used for application purposes. We respect your privacy.
          </p>
        </motion.div>
      </motion.div>

      {/* Sidebar Resume Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className={`lg:w-96 p-6 rounded-2xl border h-fit sticky top-6 ${
          theme === 'dark'
            ? 'bg-gray-800/50 border-gray-700'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        <ResumeSidebarPanel />
      </motion.div>
    </div>
  );
};
