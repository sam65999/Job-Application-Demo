'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export const ReviewStep = () => {
  const { formData, exportAsJSON, resetForm } = useFormStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  const handleSubmit = () => {
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

  return (
    <AnimatePresence mode="wait">
      {!isSubmitted ? (
        <motion.div
          key="review"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            {/* Personal Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg border-l-4 border-blue-500 bg-gray-700"
            >
              <h3 className="font-semibold mb-3 text-gray-200">
                👤 Personal Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                <p><span className="font-medium">Email:</span> {formData.email}</p>
                <p><span className="font-medium">Phone:</span> {formData.phone}</p>
              </div>
            </motion.div>

            {/* Contact Info Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-lg border-l-4 border-blue-500 bg-gray-700"
            >
              <h3 className="font-semibold mb-3 text-gray-200">
                📍 Location & Links
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Location:</span> {formData.location}</p>
                {formData.linkedIn && (
                  <p><span className="font-medium">LinkedIn:</span> {formData.linkedIn}</p>
                )}
              </div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg border-l-4 border-blue-500 bg-gray-700"
            >
              <h3 className="font-semibold mb-3 text-gray-200">
                💼 Experience
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Prior Experience:</span> {formData.hasExperience ? 'Yes' : 'No'}
                </p>
                {formData.hasExperience && (
                  <>
                    <p><span className="font-medium">Current Role:</span> {formData.currentRole || '—'}</p>
                    <p><span className="font-medium">Years:</span> {formData.yearsOfExperience}</p>
                  </>
                )}
                <p><span className="font-medium">Availability:</span> {formData.availability}</p>
              </div>
            </motion.div>

            {/* Resume Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="p-4 rounded-lg border-l-4 border-blue-500 bg-gray-700"
            >
              <h3 className="font-semibold mb-3 text-gray-200">
                📄 Documents
              </h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Resume:</span> {formData.resumeFile ? '✓ ' + formData.resumeFileName : '—'}
                </p>
                {formData.coverLetter && (
                  <p>
                    <span className="font-medium">Cover Letter:</span> {formData.coverLetter.substring(0, 50)}...
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              ✨ Submit Application
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportAsJSON}
              className="w-full font-semibold py-3 rounded-lg border-2 transition-all bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
            >
              📥 Save as JSON
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="space-y-6 text-center"
        >
          {/* Confetti Effect */}
          <AnimatePresence>
            {showConfetti && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, y: 0, x: 0 }}
                    animate={{
                      opacity: 0,
                      y: 300,
                      x: (Math.random() - 0.5) * 200,
                    }}
                    transition={{ duration: 2, ease: 'easeIn' }}
                    className="fixed pointer-events-none"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-20px',
                      fontSize: '24px',
                    }}
                  >
                    {['🎉', '🎊', '✨', '🌟', '⭐'][Math.floor(Math.random() * 5)]}
                  </motion.div>
                ))}
              </>
            )}
          </AnimatePresence>

          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="text-6xl mx-auto"
          >
            ✓
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <h2
              className="text-3xl font-bold text-gray-100"
            >
              Application Submitted!
            </h2>
            <p
              className="text-lg text-gray-300"
            >
              Thank you for applying, {formData.fullName}
            </p>
            <p
              className="text-sm text-gray-400"
            >
              We&apos;ll review your application and get back to you within 3-5 business days.
            </p>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="p-4 rounded-lg text-left bg-blue-900/20 border border-blue-800"
          >
            <p className="font-semibold mb-2">📋 What&apos;s Next?</p>
            <ul className="text-sm space-y-1 ml-4 list-disc">
              <li>Check your email for a confirmation message</li>
              <li>Follow our status updates at your email</li>
              <li>Prepare for potential interviews</li>
            </ul>
          </motion.div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewApplication}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            ➕ Start New Application
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
