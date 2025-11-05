'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { EditIcon, DownloadIcon, SparklesIcon } from '@/components/ui/Icons';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const ReviewStep = () => {
  const { formData, exportAsJSON, resetForm, setCurrentStep, theme, submitApplication } = useFormStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isSubmitted) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = () => {
    submitApplication();
    setIsSubmitted(true);
  };

  const handleNewApplication = () => {
    resetForm();
    setIsSubmitted(false);
  };

  const validate = () => true;
  if (typeof window !== 'undefined') {
    (window as { __validateReview?: () => boolean }).__validateReview = validate;
  }

  const editStep = (step: number) => {
    setCurrentStep(step);
  };

  // Success overlay rendered via portal
  const successOverlay = isSubmitted && mounted ? createPortal(
    <AnimatePresence>
      <motion.div
        key="success"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 z-[9999]"
      >
        <div className="text-center space-y-8 max-w-2xl px-6">
          {/* Confetti */}
          <AnimatePresence>
            {showConfetti && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 1,
                      y: -50,
                      x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                      rotate: 0,
                    }}
                    animate={{
                      opacity: [1, 1, 0],
                      y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
                      x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                      rotate: Math.random() * 720 - 360,
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      ease: 'easeIn',
                    }}
                    className="absolute text-3xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                    }}
                  >
                    {['🎉', '🎊', '✨', '🌟', '⭐', '💫', '🎈'][Math.floor(Math.random() * 7)]}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-green-500/20"
          >
            <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white">
              Application Submitted!
            </h2>
            <p className="text-xl text-gray-300">
              Thank you, <span className="font-semibold">{formData.fullName}</span>
            </p>
            <p className="text-base text-gray-400 max-w-md mx-auto">
              We&apos;ve received your application and will review it carefully. You&apos;ll hear from us within 3-5 business days.
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-lg mx-auto p-6 rounded-2xl text-left bg-blue-900/20 border-2 border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-blue-300">
                What happens next?
              </h3>
            </div>
            <ul className="space-y-3 text-sm text-blue-200/90">
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-0.5">1.</span>
                <span>Check your email for a confirmation message</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-0.5">2.</span>
                <span>Our team will review your application</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-0.5">3.</span>
                <span>We&apos;ll reach out if your profile matches our needs</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 mt-0.5">4.</span>
                <span>Prepare for potential interviews—good luck!</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={handleNewApplication}
            className="
              px-8 py-4 rounded-xl font-semibold
              bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
              text-white shadow-lg shadow-blue-500/30 transition-all
            "
          >
            Start New Application
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  ) : null;

  return (
    <>
      {successOverlay}
        <motion.div
          key="review"
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
              Review your application
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`text-lg ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              Double-check everything looks perfect before submitting
            </motion.p>
          </div>

          {/* Summary Cards */}
          <div className="space-y-4">
            {/* Personal Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className={`
                p-6 rounded-2xl border-l-4 border-blue-500
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
              `}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Personal Information
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editStep(0)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-blue-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-blue-600'
                    }
                  `}
                >
                  <EditIcon />
                  Edit
                </motion.button>
              </div>
              <div className={`space-y-2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className={`
                p-6 rounded-2xl border-l-4 border-purple-500
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
              `}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Location & Links
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editStep(1)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-purple-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-purple-600'
                    }
                  `}
                >
                  <EditIcon />
                  Edit
                </motion.button>
              </div>
              <div className={`space-y-2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><span className="font-medium">Location:</span> {formData.location}</p>
                {formData.linkedIn && (
                  <p><span className="font-medium">LinkedIn:</span> {formData.linkedIn}</p>
                )}
                {formData.portfolio && (
                  <p><span className="font-medium">Portfolio:</span> {formData.portfolio}</p>
                )}
                {!formData.linkedIn && !formData.portfolio && (
                  <p className={ 'text-gray-500'}>No professional links added</p>
                )}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`
                p-6 rounded-2xl border-l-4 border-green-500
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
              `}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Experience & Preferences
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editStep(2)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-green-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-green-600'
                    }
                  `}
                >
                  <EditIcon />
                  Edit
                </motion.button>
              </div>
              <div className={`space-y-2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><span className="font-medium">Experience:</span> {formData.hasExperience ? 'Yes' : 'No prior experience'}</p>
                {formData.hasExperience && (
                  <>
                    {formData.currentRole && <p><span className="font-medium">Role:</span> {formData.currentRole}</p>}
                    {formData.company && <p><span className="font-medium">Company:</span> {formData.company}</p>}
                    {formData.yearsOfExperience && <p><span className="font-medium">Years:</span> {formData.yearsOfExperience}</p>}
                  </>
                )}
                <p><span className="font-medium">Availability:</span> {formData.availability}</p>
                <p><span className="font-medium">Work Preference:</span> {formData.remote}</p>
              </div>
            </motion.div>

            {/* Documents */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className={`
                p-6 rounded-2xl border-l-4 border-orange-500
                ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}
              `}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-100'
                  }`}>
                    <svg className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className={`font-semibold text-lg ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Documents
                  </h3>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => editStep(3)}
                  className={`
                    flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-orange-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-orange-600'
                    }
                  `}
                >
                  <EditIcon />
                  Edit
                </motion.button>
              </div>
              <div className={`space-y-2 text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <p><span className="font-medium">Resume:</span> {formData.resumeFile ? '✓ ' + formData.resumeFileName : '—'}</p>
                {formData.coverLetter ? (
                  <div>
                    <p className="font-medium mb-1">Cover Letter:</p>
                    <p className={`text-xs line-clamp-3 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formData.coverLetter}
                    </p>
                  </div>
                ) : (
                  <p className={'text-gray-500'}>No cover letter added</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleSubmit}
              className="
                w-full px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2
                bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                text-white shadow-lg shadow-blue-500/30 transition-all
              "
            >
              <SparklesIcon />
              Submit Application
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              onClick={exportAsJSON}
              className={`
                w-full px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2
                border-2 transition-all
                ${theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                }
              `}
            >
              <DownloadIcon />
              Save as JSON
            </motion.button>
          </div>
        </motion.div>
    </>
  );
};
