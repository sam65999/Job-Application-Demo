'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { useState } from 'react';

export const PersonalInfoStep = () => {
  const { formData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Expose validation to parent
  if (typeof window !== 'undefined') {
    (window as { __validatePersonalInfo?: () => boolean }).__validatePersonalInfo = validate;
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
          htmlFor="fullName"
          className="block text-sm font-medium transition-colors text-gray-200"
        >
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => {
            updateFormData({ fullName: e.target.value });
            setErrors({ ...errors, fullName: '' });
          }}
          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
        />
        {errors.fullName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {errors.fullName}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium transition-colors text-gray-200"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => {
            updateFormData({ email: e.target.value });
            setErrors({ ...errors, email: '' });
          }}
          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {errors.email}
          </motion.p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="block text-sm font-medium transition-colors text-gray-200"
        >
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          value={formData.phone}
          onChange={(e) => {
            updateFormData({ phone: e.target.value });
            setErrors({ ...errors, phone: '' });
          }}
          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 bg-gray-700 border-gray-600 text-white"
        />
        {errors.phone && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {errors.phone}
          </motion.p>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-3 rounded-lg bg-blue-900/20 border border-blue-800 text-blue-300"
      >
        <p className="text-sm">
          💡 We&apos;ll use this info to keep you updated on your application status.
        </p>
      </motion.div>
    </motion.div>
  );
};
