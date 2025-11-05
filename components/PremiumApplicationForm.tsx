'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { PersonalInfoStep } from './steps/PremiumPersonalInfoStep';
import { ContactStep } from './steps/PremiumContactStep';
import { ExperienceStep } from './steps/PremiumExperienceStep';
import { ResumeStep } from './steps/PremiumResumeStep';
import { ReviewStep } from './steps/PremiumReviewStep';
import { Timeline } from './ui/Timeline';
import { AIAssistant } from './AIAssistant';
import { ThemeToggle } from './ui/ThemeToggle';
import { HiringManagerView } from './HiringManagerView';
import { InfoCard } from './InfoCard';
import { useMobile } from '@/hooks/useMobile';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export const PremiumApplicationForm = () => {
  const { formData, currentStep, setCurrentStep, markStepComplete, saveProgress, savedProgress, resetForm, theme } = useFormStore();
  const isMobile = useMobile();
  const [isNext, setIsNext] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHiringManager, setShowHiringManager] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll to top when currentStep changes on mobile
  useEffect(() => {
    if (mounted && isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, mounted, isMobile]);

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
      markStepComplete(currentStep);
      setIsNext(true);
      setCurrentStep(Math.min(currentStep + 1, 4));
    }
  };

  const handlePrev = () => {
    setIsNext(false);
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleReset = () => {
    resetForm();
    setShowResetConfirm(false);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <PersonalInfoStep />;
      case 1: return <ContactStep />;
      case 2: return <ExperienceStep />;
      case 3: return <ResumeStep />;
      case 4: return <ReviewStep />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      {/* Animated Background Orbs - Disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl ${
              theme === 'dark' ? 'opacity-10 bg-blue-600' : 'opacity-5 bg-blue-400'
            }`}
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className={`absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl ${
              theme === 'dark' ? 'opacity-10 bg-purple-600' : 'opacity-5 bg-purple-400'
            }`}
          />
        </div>
      )}

      {/* Header - Mobile Only */}
      <header className={`lg:hidden sticky top-0 z-50 backdrop-blur-xl border-b ${
        theme === 'dark'
          ? 'bg-gray-900/80 border-gray-800'
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative w-10 h-10">
                <Image
                  src={theme === 'light' ? '/HireFlowLight.png' : '/hireflowlogo.png'}
                  alt="HireFlow Logo"
                  fill
                  className="object-contain transition-opacity duration-300"
                  priority
                  key={theme}
                />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>HireFlow</h1>
                <p className={`text-[10px] ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>Your career journey</p>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <motion.button
                whileHover={isMobile ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={saveProgress}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="hidden sm:inline">Save</span>
              </motion.button>
              {/* Reset Button - Mobile */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowResetConfirm(true)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                  theme === 'dark'
                    ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/30'
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                }`}
                title="Reset form"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Save Progress Toast */}
        <AnimatePresence>
          {savedProgress && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Progress saved!
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="lg:flex lg:min-h-screen">
        {/* Left Sidebar - Timeline (Desktop) */}
        <aside className={`hidden lg:block lg:w-80 xl:w-96 lg:fixed lg:left-0 lg:top-0 lg:h-screen backdrop-blur-xl border-r ${
          theme === 'dark'
            ? 'bg-gray-900/50 border-gray-800'
            : 'bg-white/50 border-gray-200'
        }`}>
          <div className="p-8">
            {/* Logo and Actions */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12">
                  <Image
                    src={theme === 'light' ? '/HireFlowLight.png' : '/hireflowlogo.png'}
                    alt="HireFlow Logo"
                    fill
                    className="object-contain transition-opacity duration-300"
                    priority
                    key={theme}
                  />
                </div>
                <div>
                  <h1 className={`text-2xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>HireFlow</h1>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Your career journey</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="mb-6 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowHiringManager(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    !showHiringManager
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white shadow-lg'
                      : theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Job Application
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowHiringManager(true)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    showHiringManager
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-500 text-white shadow-lg'
                      : theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Hiring Manager View
                </motion.button>
              </div>

              <div className="flex gap-2">
                <ThemeToggle />
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveProgress}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save
                </motion.button>
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResetConfirm(true)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    theme === 'dark'
                      ? 'bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/30'
                      : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                  }`}
                  title="Reset form"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>

            {!showHiringManager && <Timeline />}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="lg:ml-80 xl:ml-96 flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
            {/* Mobile Navigation */}
            <div className="lg:hidden mb-6">
              <div className={`p-4 rounded-2xl border backdrop-blur-xl ${
                theme === 'dark'
                  ? 'bg-gray-800/50 border-gray-700'
                  : 'bg-white/80 border-gray-200'
              }`}>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowHiringManager(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      !showHiringManager
                        ? 'bg-blue-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Application</span>
                  </button>
                  <button
                    onClick={() => setShowHiringManager(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      showHiringManager
                        ? 'bg-blue-600 text-white shadow-lg'
                        : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="hidden sm:inline">Manager</span>
                  </button>
                </div>
                {!showHiringManager && <Timeline />}
              </div>
            </div>

            {/* Content */}
            {showHiringManager ? (
              <HiringManagerView />
            ) : (
              <>
                {/* Form Card */}
                <motion.div
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isMobile ? {} : { duration: 0.3 }}
                  className={`relative overflow-hidden rounded-3xl border backdrop-blur-xl shadow-2xl mb-6 ${
                    theme === 'dark'
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white/90 border-gray-200'
                  }`}
                >
                  {/* Step Content */}
                  <div className="p-8 sm:p-12">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`step-${currentStep}`}
                        initial={isMobile ? { opacity: 0 } : { opacity: 0, x: isNext ? 40 : -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={isMobile ? { opacity: 0 } : { opacity: 0, x: isNext ? -40 : 40 }}
                        transition={isMobile ? { duration: 0.2 } : { duration: 0.3 }}
                      >
                        {renderStep()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation */}
                  <div className={`border-t px-8 sm:px-12 py-6 ${
                    theme === 'dark'
                      ? 'border-gray-700 bg-gray-900/30'
                      : 'border-gray-200 bg-gray-50/50'
                  }`}>
                    <div className="flex gap-4">
                      {/* Back Button */}
                      {currentStep > 0 && (
                        <motion.button
                          whileHover={isMobile ? {} : { scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePrev}
                          className={`flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                            theme === 'dark'
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                          }`}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          Back
                        </motion.button>
                      )}

                      {/* Next Button */}
                      {currentStep < 4 && (
                        <motion.button
                          whileHover={isMobile ? {} : { scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNext}
                          className="
                            flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2
                            bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                            text-white shadow-lg shadow-blue-500/30 transition-all
                          "
                        >
                          Continue
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      )}
                    </div>

                    {/* Help Text */}
                    <p className={`text-center text-sm mt-4 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      {currentStep < 4
                        ? 'Have questions? Use the AI Assistant on the right for help!'
                        : 'Review your information before submitting'
                      }
                    </p>
                  </div>
                </motion.div>

                {/* Tips Card */}
                <motion.div
                  initial={{ opacity: isMobile ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  transition={isMobile ? {} : { delay: 0.3 }}
                  className={`p-6 rounded-2xl border backdrop-blur-xl ${
                    theme === 'dark'
                      ? 'bg-blue-900/20 border-blue-500/30'
                      : 'bg-blue-50/80 border-blue-200/50'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-200'
                      }`}>
                        <svg className={`w-5 h-5 ${
                          theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        theme === 'dark' ? 'text-blue-400' : 'text-blue-700'
                      }`}>Quick Tip</h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-blue-300/90' : 'text-blue-900/80'
                      }`}>
                        {[
                          'Your progress is automatically saved. You can return anytime to continue your application.',
                          'Add your LinkedIn or portfolio to showcase your professional presence.',
                          'Be specific about your experience. Quality over quantity makes a difference.',
                          'Upload a recent resume (PDF preferred) and write a compelling cover letter.',
                          'Double-check your information before submitting. First impressions matter!',
                        ][currentStep]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-16 border-t backdrop-blur-xl lg:ml-80 xl:ml-96 ${
        theme === 'dark'
          ? 'bg-gray-900/70 border-gray-800'
          : 'bg-white/70 border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              © 2025 HireFlow. Crafted with care for your career journey.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className={`text-sm hover:underline ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                Privacy
              </a>
              <a href="#" className={`text-sm hover:underline ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                Terms
              </a>
              <a href="#" className={`text-sm hover:underline ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-gray-300'
                  : 'text-gray-600 hover:text-gray-800'
              }`}>
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl p-8 shadow-2xl ${
                theme === 'dark'
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-gray-200'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>Reset Form?</h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>This action cannot be undone</p>
                </div>
              </div>
              <p className={`mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Are you sure you want to reset the entire form? All your progress, uploaded files, and entered information will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowResetConfirm(false)}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600 text-white'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-all"
                >
                  Reset Form
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI Assistant */}
      <AIAssistant
        userContext={{
          location: formData.location,
          experience: formData.hasExperience
            ? `${formData.yearsOfExperience} years as ${formData.currentRole}${formData.company ? ` at ${formData.company}` : ''}`
            : 'No prior experience',
          availability: formData.availability,
        }}
      />

      {/* Info Card */}
      <InfoCard />
    </div>
  );
};
