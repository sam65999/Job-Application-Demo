'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useFormStore } from '@/lib/store';
import { parseResume, ExtractedData } from '@/lib/resume-parser';
import { UploadIcon, CheckIcon, SparklesIcon } from '@/components/ui/Icons';

export const ResumeSidebarPanel = () => {
  const { autoFillFormData, theme } = useFormStore();
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const data = await parseResume(file);
      setExtractedData(data);
      
      // Auto-fill form data
      autoFillFormData({
        resumeFile: file,
        resumeFileName: file.name,
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        linkedIn: data.linkedIn || '',
        portfolio: data.portfolio || '',
      });
    } catch (err) {
      console.error('Error parsing resume:', err);
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const getFieldsFound = () => {
    if (!extractedData) return 0;
    return [
      extractedData.fullName,
      extractedData.email,
      extractedData.phone,
      extractedData.location,
      extractedData.linkedIn,
      extractedData.portfolio
    ].filter(Boolean).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
        }`}>
          <SparklesIcon className={`w-5 h-5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
        <div>
          <h3 className={`text-lg font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Resume Auto-Fill</h3>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>Optional - Speed up your application</p>
        </div>
      </div>

      {/* Upload Section */}
      <AnimatePresence mode="wait">
        {!extractedData ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
              className={`
                relative p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer
                ${dragActive
                  ? theme === 'dark'
                    ? 'border-blue-400 bg-blue-900/20 scale-105'
                    : 'border-blue-500 bg-blue-50 scale-105'
                  : error
                  ? theme === 'dark'
                    ? 'border-red-500 bg-red-900/20'
                    : 'border-red-500 bg-red-50'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                }
                ${isProcessing ? 'pointer-events-none' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="hidden"
                disabled={isProcessing}
              />
              
              <div className="text-center">
                <motion.div
                  animate={
                    isProcessing 
                      ? { rotate: 360 } 
                      : dragActive 
                      ? { scale: [1, 1.1, 1] } 
                      : {}
                  }
                  transition={{ 
                    duration: isProcessing ? 2 : 0.3,
                    repeat: isProcessing ? Infinity : 1,
                    ease: isProcessing ? 'linear' : 'easeInOut'
                  }}
                  className="flex justify-center mb-4"
                >
                  <div className={`
                    p-4 rounded-full
                    ${dragActive
                      ? theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-200 text-blue-700'
                      : error
                      ? theme === 'dark' ? 'bg-red-500/20 text-red-400' : 'bg-red-200 text-red-700'
                      : isProcessing
                      ? theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-200 text-blue-700'
                      : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {isProcessing ? (
                      <motion.div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full" />
                    ) : (
                      <UploadIcon className="w-6 h-6" />
                    )}
                  </div>
                </motion.div>
                
                <h4 className={`text-base font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {isProcessing 
                    ? 'Processing...'
                    : dragActive 
                    ? 'Drop here' 
                    : 'Upload Resume'
                  }
                </h4>
                
                <p className={`text-xs mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {isProcessing 
                    ? 'Extracting information'
                    : 'Drag & drop or click'
                  }
                </p>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    PDF/DOCX
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    Max 10MB
                  </span>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 mt-4 text-xs"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-6 rounded-xl border ${
              theme === 'dark'
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex justify-center mb-4"
              >
                <div className={`p-3 rounded-full ${
                  theme === 'dark' ? 'bg-green-500/20' : 'bg-green-200'
                }`}>
                  <CheckIcon className={`w-6 h-6 ${
                    theme === 'dark' ? 'text-green-400' : 'text-green-700'
                  }`} />
                </div>
              </motion.div>
              
              <h4 className={`text-base font-bold mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Resume processed!
              </h4>
              
              <p className={`mb-4 text-sm ${
                theme === 'dark' ? 'text-green-300' : 'text-green-700'
              }`}>
                Found {getFieldsFound()} pieces of information
              </p>

              <div className="space-y-2 text-xs text-left">
                {extractedData.fullName && (
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <CheckIcon className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className="truncate">Name: {extractedData.fullName}</span>
                  </div>
                )}
                {extractedData.email && (
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <CheckIcon className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className="truncate">Email: {extractedData.email}</span>
                  </div>
                )}
                {extractedData.phone && (
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <CheckIcon className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className="truncate">Phone: {extractedData.phone}</span>
                  </div>
                )}
                {extractedData.location && (
                  <div className={`flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <CheckIcon className={`w-3 h-3 ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`} />
                    <span className="truncate">Location: {extractedData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info */}
      <div className={`p-4 rounded-xl border ${
        theme === 'dark'
          ? 'bg-blue-900/20 border-blue-500/30'
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex gap-3">
          <svg className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-blue-300/90' : 'text-blue-900/90'
          }`}>
            We&apos;ll extract your info and fill the form automatically. Your resume will be saved for the documents section.
          </p>
        </div>
      </div>
    </motion.div>
  );
};