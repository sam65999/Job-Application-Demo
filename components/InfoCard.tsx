'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { useMobile } from '@/hooks/useMobile';
import { useState } from 'react';

export const InfoCard = () => {
  const { theme } = useFormStore();
  const isMobile = useMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Compact Button */}
      {!isExpanded && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
          whileHover={isMobile ? {} : { scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className={`
            fixed z-40
            ${isMobile ? 'bottom-4 left-4' : 'bottom-6 left-6'}
            w-12 h-12 rounded-full
            backdrop-blur-xl border
            shadow-lg
            flex items-center justify-center
            transition-all
            ${
              theme === 'dark'
                ? 'bg-gray-800/90 border-gray-700 hover:bg-gray-700/90'
                : 'bg-white/90 border-gray-200 hover:bg-gray-50'
            }
          `}
          aria-label="Project info"
        >
          <svg 
            className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </motion.button>
      )}

      {/* Expanded Card */}
      {isExpanded && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
          )}

          {/* Info Card */}
          <motion.div
            initial={isMobile ? { opacity: 0, scale: 0.9 } : { opacity: 0, x: -100 }}
            animate={isMobile ? { opacity: 1, scale: 1 } : { opacity: 1, x: 0 }}
            exit={isMobile ? { opacity: 0, scale: 0.9 } : { opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className={`
              fixed z-50
              ${
                isMobile
                  ? 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-sm'
                  : 'bottom-6 left-6 w-80'
              }
              backdrop-blur-xl border rounded-2xl shadow-2xl
              ${
                theme === 'dark'
                  ? 'bg-gray-800/95 border-gray-700'
                  : 'bg-white/95 border-gray-200'
              }
            `}
          >
            {/* Header */}
            <div className={`
              px-5 py-4 border-b flex items-center justify-between
              ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gradient-to-r from-blue-900/20 to-purple-900/20'
                  : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'
              }
            `}>
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}
                `}>
                  <svg 
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-bold text-sm ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    About This Project
                  </h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    HireFlow
                  </p>
                </div>
              </div>
              
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className={`
                  w-8 h-8 rounded-lg flex items-center justify-center
                  transition-colors
                  ${
                    theme === 'dark'
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                  }
                `}
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Description */}
              <p className={`text-sm leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                This was a challenge and just a quick fun project. Everything here is not being sent anywhere and is just for demo purposes. If you want to reach out to me, feel free to use the contact links below! DISCLAIMER!! If the AI does not work, it is because it has been rate limited as this is a free cost project, if the ai does not work, try again later.
              </p>

              {/* Links */}
              <div className="space-y-2">
                <p className={`text-xs font-semibold uppercase tracking-wide ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                }`}>
                  Connect
                </p>
                
                {/* GitHub */}
                <motion.a
                  href="https://github.com/sam65999"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    transition-all group
                    ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
                    group-hover:scale-110 transition-transform
                  `}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">GitHub</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      @sam65999
                    </p>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>

                {/* Portfolio */}
                <motion.a
                  href="https://samsprofolio.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    transition-all group
                    ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
                    group-hover:scale-110 transition-transform
                  `}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Portfolio</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      samsprofolio.com
                    </p>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:samuelr.aidev@gmail.com"
                  whileHover={{ x: 4 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg
                    transition-all group
                    ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
                    group-hover:scale-110 transition-transform
                  `}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email</p>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      samuelr.aidev@gmail.com
                    </p>
                  </div>
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              </div>

              {/* Footer note */}
              <div className={`
                pt-3 border-t text-xs text-center
                ${theme === 'dark' ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-600'}
              `}>
                Built with Next.js, Tailwind & Framer Motion
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};
