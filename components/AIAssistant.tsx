'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useFormStore } from '@/lib/store';
import { useMobile } from '@/hooks/useMobile';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  userContext: {
    location: string;
    experience: string;
    availability: string;
  };
}

export const AIAssistant = ({ userContext }: AIAssistantProps) => {
  const { theme } = useFormStore();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm here to help you fill out your job application efficiently. Ask me anything about the form fields, tips for presenting your experience, or how to make your application stand out!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !hasConsent) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: userContext,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button - Hidden on mobile when open */}
      {!(isMobile && isOpen) && (
        <motion.button
          initial={isMobile ? { opacity: 1, scale: 1 } : { scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1
          }}
          transition={isMobile ? { duration: 0.3 } : { delay: 0.5, duration: 0.3 }}
          whileHover={isMobile ? {} : { scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className={`
            fixed right-4 lg:right-6 z-50
            bottom-20 sm:bottom-24 lg:bottom-6
            w-14 h-14 lg:w-16 lg:h-16 rounded-2xl
            bg-gradient-to-br from-blue-500 to-purple-600
            hover:from-blue-600 hover:to-purple-700
            shadow-2xl shadow-blue-500/30
            flex items-center justify-center
            transition-all
          `}
        >
          <svg className="w-6 h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </motion.button>
      )}

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={isMobile ? { opacity: 0 } : { opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={isMobile ? { opacity: 0 } : { opacity: 0, x: 400 }}
            transition={isMobile ? { duration: 0.2 } : { type: 'spring', damping: 25, stiffness: 200 }}
            className={`
              fixed z-40
              rounded-2xl
              backdrop-blur-xl
              border
              shadow-2xl
              flex flex-col
              overflow-hidden
              ${
                isMobile
                  ? 'left-4 right-4 top-20 bottom-32'
                  : 'right-4 bottom-32 lg:right-6 lg:bottom-28 w-[calc(100vw-2rem)] max-w-[380px] h-[calc(100vh-12rem)] max-h-[600px]'
              }
              ${
                theme === 'dark'
                  ? 'bg-gray-800/95 border-gray-700'
                  : 'bg-white/95 border-gray-200'
              }
            `}
          >
            {/* Header */}
            <div className={`
              px-6 py-4
              border-b
              ${
                theme === 'dark'
                  ? 'border-gray-700 bg-gradient-to-r from-blue-900/30 to-purple-900/30'
                  : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'
              }
            `}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>AI Assistant</h3>
                  <p className={`text-xs ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>Always here to help</p>
                </div>
                {/* Close Button */}
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    transition-all
                    ${
                      theme === 'dark'
                        ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                        : 'hover:bg-gray-200 text-gray-700 hover:text-gray-900'
                    }
                  `}
                  aria-label="Close AI Assistant"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={isMobile ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isMobile ? {} : { duration: 0.3 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[85%] px-4 py-3 rounded-2xl
                    ${message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700/70 text-gray-100'
                        : 'bg-gray-100 text-gray-800'
                    }
                  `}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`px-4 py-3 rounded-2xl ${
                    theme === 'dark' ? 'bg-gray-700/70' : 'bg-gray-100'
                  }`}>
                    <div className="flex gap-1">
                      {!isMobile ? (
                        <>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-gray-400 rounded-full"
                          />
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Consent Checkbox */}
            <div className={`px-4 py-3 border-t ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-900/50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className={`mt-0.5 w-4 h-4 rounded border-2 transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 checked:bg-blue-500 checked:border-blue-500'
                      : 'bg-white border-gray-300 checked:bg-blue-500 checked:border-blue-500'
                  }`}
                />
                <div className="flex-1">
                  <span className={`text-xs leading-relaxed ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                  I agree to allow HireFlow&apos;s AI Assistant to use my form data to provide application guidance.
                  </span>
                  {(userContext.location || userContext.experience || userContext.availability !== 'immediately') && hasConsent && (
                    <div className={`flex items-center gap-2 text-xs mt-2 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Using your form context</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${
              theme === 'dark'
                ? 'border-gray-700 bg-gray-900/50'
                : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={isLoading}
                  className={`
                    flex-1 px-4 py-3 rounded-xl
                    border
                    focus:outline-none focus:border-blue-500
                    transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      theme === 'dark'
                        ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }
                  `}
                />
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !hasConsent}
                  className="
                    px-3 py-3 lg:px-4 rounded-xl
                    bg-gradient-to-r from-blue-500 to-purple-600
                    hover:from-blue-600 hover:to-purple-700
                    disabled:from-gray-600 disabled:to-gray-600
                    text-white
                    transition-all
                    disabled:cursor-not-allowed disabled:opacity-50
                  "
                  title={!hasConsent ? 'Please agree to data usage first' : ''}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};
