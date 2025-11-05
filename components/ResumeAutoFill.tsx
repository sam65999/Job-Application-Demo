'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useFormStore } from '@/lib/store';
import { parseResume, ExtractedData } from '@/lib/resume-parser';
import { UploadIcon, CheckIcon, SparklesIcon } from '@/components/ui/Icons';

export const ResumeAutoFill = () => {
  const { autoFillFormData } = useFormStore();
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

  const skipAutoFill = () => {
    // Simply navigate or close - implement based on your routing
    window.location.href = '/';
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl opacity-10 bg-blue-600"
        />
        <motion.div
          animate={{
            scale: [1.3, 1, 1.3],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full blur-3xl opacity-10 bg-purple-600"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <SparklesIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Smart Resume Auto-Fill
            </h1>
            <p className="text-xl text-gray-400 max-w-xl mx-auto">
              Upload your resume and we&apos;ll automatically extract your information to speed up the application
            </p>
          </motion.div>

          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
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
                      relative p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer backdrop-blur-xl
                      ${dragActive
                        ? 'border-blue-400 bg-blue-900/20 scale-105'
                        : error
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
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
                        className="flex justify-center mb-6"
                      >
                        <div className={`
                          p-6 rounded-full
                          ${dragActive
                            ? 'bg-blue-500/20 text-blue-400'
                            : error
                            ? 'bg-red-500/20 text-red-400'
                            : isProcessing
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-gray-700 text-gray-300'
                          }
                        `}>
                          {isProcessing ? (
                            <motion.div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full" />
                          ) : (
                            <UploadIcon className="w-8 h-8" />
                          )}
                        </div>
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {isProcessing 
                          ? 'Processing your resume...'
                          : dragActive 
                          ? 'Drop your resume here' 
                          : 'Upload your resume'
                        }
                      </h3>
                      
                      <p className="text-gray-400 mb-6">
                        {isProcessing 
                          ? 'Extracting information from your resume'
                          : 'Drag and drop your resume or click to browse'
                        }
                      </p>

                      <div className="flex items-center justify-center gap-4 flex-wrap">
                        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                          PDF
                        </span>
                        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                          DOCX
                        </span>
                        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-700 text-gray-300">
                          Max 10MB
                        </span>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 mt-4 text-sm"
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
                  className="relative p-8 rounded-3xl border backdrop-blur-xl bg-green-900/20 border-green-500/30"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                      className="flex justify-center mb-6"
                    >
                      <div className="p-4 rounded-full bg-green-500/20">
                        <CheckIcon className="w-8 h-8 text-green-400" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Resume processed successfully!
                    </h3>
                    
                    <p className="text-green-300 mb-6">
                      Found {getFieldsFound()} pieces of information from your resume
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      {extractedData.fullName && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span>Full Name: {extractedData.fullName}</span>
                        </div>
                      )}
                      {extractedData.email && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span>Email: {extractedData.email}</span>
                        </div>
                      )}
                      {extractedData.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span>Phone: {extractedData.phone}</span>
                        </div>
                      )}
                      {extractedData.location && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span>Location: {extractedData.location}</span>
                        </div>
                      )}
                      {extractedData.linkedIn && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span>LinkedIn found</span>
                        </div>
                      )}
                      {extractedData.portfolio && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CheckIcon className="w-4 h-4 text-green-400" />
                          <span>Portfolio found</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={skipAutoFill}
                className="flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white transition-all"
              >
                {extractedData ? 'Continue to Application' : 'Skip and Fill Manually'}
              </motion.button>
              
              {!extractedData && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  <UploadIcon className="w-5 h-5" />
                  Choose File
                </motion.button>
              )}
            </motion.div>
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-6 rounded-2xl border backdrop-blur-xl bg-blue-900/20 border-blue-500/30"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500/20">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1 text-blue-400">How it works</h3>
                <p className="text-sm text-blue-300/90">
                  We&apos;ll extract your personal information, contact details, and links from your resume.
                  You can always edit any field manually in the next steps. Your resume will be saved for the documents section.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};