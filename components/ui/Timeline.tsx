'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';

interface Step {
  id: number;
  label: string;
  icon: string;
}

const STEPS: Step[] = [
  { id: 0, label: 'Personal Info', icon: '👤' },
  { id: 1, label: 'Contact', icon: '📧' },
  { id: 2, label: 'Experience', icon: '💼' },
  { id: 3, label: 'Documents', icon: '📄' },
  { id: 4, label: 'Review', icon: '✓' },
];

export const Timeline = () => {
  const { currentStep, completedSteps, theme } = useFormStore();

  return (
    <div className="relative">
      {/* Desktop Sidebar Timeline */}
      <div className="hidden lg:block">
        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Progress</span>
            <span className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {Math.round((currentStep / (STEPS.length - 1)) * 100)}%
            </span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            />
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className={`absolute left-8 top-8 bottom-8 w-0.5 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
          }`} />
          
          {/* Animated Progress Line */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ 
              height: currentStep === 0 ? '0%' : `calc(${(currentStep / (STEPS.length - 1)) * 100}% + ${currentStep * 6}px)` 
            }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute left-8 top-8 w-0.5 bg-gradient-to-b from-blue-500 via-blue-500 to-blue-600 z-10"
          />

          <div className="space-y-6">
            {STEPS.map((step, index) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);
              const isPast = step.id < currentStep;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex items-center gap-5"
                >
                  {/* Step Circle */}
                  <motion.div
                    className={`
                      relative z-20 w-14 h-14 rounded-xl flex items-center justify-center
                      text-xl transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50'
                        : isPast || isCompleted
                        ? theme === 'dark'
                          ? 'bg-gray-800 border-2 border-green-500/60'
                          : 'bg-gray-100 border-2 border-green-500'
                        : theme === 'dark'
                          ? 'bg-gray-800/50 border-2 border-gray-700'
                          : 'bg-gray-100 border-2 border-gray-300'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isCompleted && !isActive ? (
                      <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>✓</span>
                    ) : (
                      <span className={
                        isActive || isPast
                          ? 'text-white'
                          : theme === 'dark'
                            ? 'text-gray-600'
                            : 'text-gray-400'
                      }>
                        {step.icon}
                      </span>
                    )}
                    
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-blue-500"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* Step Label */}
                  <div className="flex-1">
                    <h3 className={`
                      font-semibold text-base transition-colors
                      ${isActive
                        ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                        : isPast || isCompleted
                        ? theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        : theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                      }
                    `}>
                      {step.label}
                    </h3>
                    <p className={`text-xs ${
                      theme === 'dark' ? 'text-gray-600' : 'text-gray-500'
                    }`}>
                      Step {step.id + 1} of {STEPS.length}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden">
        <div className="flex justify-between items-center px-2">
          {STEPS.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = completedSteps.includes(step.id);
            const isPast = step.id < currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 flex-1 relative">
                <motion.div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center text-lg
                    transition-all duration-300 relative z-10
                    ${isActive
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50 scale-110'
                      : isPast || isCompleted
                      ? theme === 'dark'
                        ? 'bg-gray-800 border-2 border-green-500/60'
                        : 'bg-gray-100 border-2 border-green-500'
                      : theme === 'dark'
                        ? 'bg-gray-800/50 border-2 border-gray-700'
                        : 'bg-gray-100 border-2 border-gray-300'
                    }
                  `}
                  animate={isActive ? { scale: [1.1, 1.15, 1.1] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isCompleted && !isActive ? (
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>✓</span>
                  ) : (
                    <span className={
                      isActive || isPast
                        ? 'text-white'
                        : theme === 'dark'
                          ? 'text-gray-600'
                          : 'text-gray-400'
                    }>
                      {step.icon}
                    </span>
                  )}
                </motion.div>
                
                <span className={`
                  text-[10px] font-medium text-center leading-tight
                  ${isActive
                    ? theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                  }
                `}>
                  {step.label}
                </span>

                {index < STEPS.length - 1 && (
                  <div className="absolute top-6 left-[60%] w-full h-0.5 z-0">
                    <div className={`
                      h-full
                      ${isPast || currentStep > index
                        ? 'bg-green-500'
                        : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-300'
                      }
                    `} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
