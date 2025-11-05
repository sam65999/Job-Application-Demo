'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { PersonalInfoStep } from './steps/PersonalInfoStep';
import { ContactStep } from './steps/ContactStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { ResumeStep } from './steps/ResumeStep';
import { ReviewStep } from './steps/ReviewStep';
import { useState, useEffect } from 'react';

const STEPS = [
  { id: 0, label: 'Personal', icon: '👤' },
  { id: 1, label: 'Contact', icon: '📧' },
  { id: 2, label: 'Experience', icon: '💼' },
  { id: 3, label: 'Documents', icon: '📄' },
  { id: 4, label: 'Review', icon: '✓' },
];

export const ApplicationForm = () => {
  const { currentStep, setCurrentStep } = useFormStore();
  const [isNext, setIsNext] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const validateCurrentStep = (): boolean => {
    const validatorNames = {
      0: '__validatePersonalInfo',
      1: '__validateContact',
      2: '__validateExperience',
      3: '__validateResume',
      4: '__validateReview',
    } as const;
    const validatorName = validatorNames[currentStep as keyof typeof validatorNames];
    const validator = (window as unknown as { [key: string]: () => boolean })[validatorName];
    return validator ? validator() : true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setIsNext(true);
      setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
    }
  };

  const handlePrev = () => {
    setIsNext(false);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />;
      case 1:
        return <ContactStep />;
      case 2:
        return <ExperienceStep />;
      case 3:
        return <ResumeStep />;
      case 4:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div
      className="min-h-screen transition-colors duration-300 bg-gray-900 text-gray-100"
    >
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 backdrop-blur-sm bg-gray-800/50 border-b border-gray-700"
      >
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <div className="text-2xl">🚀</div>
            <h1 className="text-xl font-bold">HireFlow</h1>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {}}
            className="px-3 py-2 rounded-lg font-medium transition-all bg-gray-700 text-yellow-300 hover:bg-gray-600"
          >
            🌙
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold opacity-75">
              Step {currentStep + 1} of {STEPS.length}
            </h2>
            <span className="text-xs font-medium opacity-60">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden bg-gray-700"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
        </motion.div>

        {/* Step Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 mb-12 overflow-x-auto pb-2"
        >
          {STEPS.map((step) => (
            <motion.button
              key={step.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (step.id < currentStep) setCurrentStep(step.id);
              }}
              disabled={step.id > currentStep}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                step.id === currentStep ? 'bg-blue-600 text-white shadow-lg'
                  : step.id < currentStep ? 'bg-green-900/40 text-green-300 border border-green-700'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl shadow-xl p-8 md:p-12 bg-gray-800 border border-gray-700"
        >
          {/* Step Title */}
          <motion.div
            key={`title-${currentStep}`}
            initial={{ opacity: 0, x: isNext ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {STEPS[currentStep].label}
            </h3>
            <p className="text-sm text-gray-400">
              {[
                'Let us know who you are',
                'How can we reach you?',
                'Tell us about your experience',
                'Share your resume and cover letter',
                'Review your application before submitting',
              ][currentStep]}
            </p>
          </motion.div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: isNext ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isNext ? -40 : 40 }}
              transition={{ duration: 0.4 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-3 mt-10 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                currentStep === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              ← Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={currentStep === STEPS.length - 1}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                currentStep === STEPS.length - 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
              }`}
            >
              Next →
            </motion.button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`text-xs text-center mt-6 text-gray-500`}
          >
            All fields are required unless marked optional. Your data is secure.
          </motion.p>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t mt-12 py-6 text-center text-sm border-gray-800 text-gray-400"
      >
        <p>HireFlow Job Application Form • Designed for premium user experience</p>
      </motion.footer>
    </div>
  );
};
