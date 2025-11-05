'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { DocumentIcon, UploadIcon, CheckIcon } from '@/components/ui/Icons';
import { useState, useRef } from 'react';

export const ResumeStep = () => {
  const { formData, updateFormData, autoFillCompleted, theme } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.resumeFile) {
      newErrors.resume = 'Please upload your resume';
    }
    
    if (formData.coverLetter && formData.coverLetter.length > 1000) {
      newErrors.coverLetter = 'Cover letter must be less than 1000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validateResume?: () => boolean }).__validateResume = validate;
  }

  const handleFile = (file: File) => {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
      setErrors({ ...errors, resume: 'Please upload a PDF or Word document' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors({ ...errors, resume: 'File size must be less than 10MB' });
      return;
    }

    updateFormData({
      resumeFile: file,
      resumeFileName: file.name,
    });
    setErrors({ ...errors, resume: '' });
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

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || '';
  };

  const getFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const characterCount = formData.coverLetter.length;
  const maxCharacters = 1000;
  const characterPercentage = (characterCount / maxCharacters) * 100;

  return (
    <motion.div
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
          Share your documents
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-lg ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {autoFillCompleted
            ? 'Your resume has been uploaded via Auto-Fill. You can upload a different one or edit the cover letter below.'
            : 'Upload your resume and tell us why you&apos;re perfect for this role'
          }
        </motion.p>
      </div>

      {/* Resume Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <label className={`flex items-center gap-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <DocumentIcon />
          Resume / CV
          <span className="text-red-500">*</span>
        </label>

        <AnimatePresence mode="wait">
          {!formData.resumeFile ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative p-12 rounded-2xl border-2 border-dashed transition-all cursor-pointer
                ${dragActive
                  ? theme === 'dark'
                    ? 'border-blue-400 bg-blue-900/20 scale-105'
                    : 'border-blue-500 bg-blue-50 scale-105'
                  : errors.resume
                  ? theme === 'dark'
                    ? 'border-red-500 bg-red-900/20'
                    : 'border-red-500 bg-red-50'
                  : theme === 'dark'
                    ? 'border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-800/50'
                    : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="hidden"
              />
              
              <div className="text-center">
                <motion.div
                  animate={dragActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mb-4"
                >
                  <div className={`
                    p-4 rounded-full
                    ${dragActive
                      ? theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-200'
                      : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }
                  `}>
                    <UploadIcon />
                  </div>
                </motion.div>
                
                <p className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {dragActive ? 'Drop your file here' : 'Drop your resume here'}
                </p>
                
                <p className={`text-sm mb-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  or click to browse
                </p>

                <div className="flex items-center justify-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    PDF
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    DOC
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    DOCX
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    Max 10MB
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                p-6 rounded-2xl border-2 transition-all
                ${theme === 'dark'
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-green-50 border-green-200'
                }
              `}
            >
              <div className="flex items-start gap-4">
                <div className={`
                  flex-shrink-0 p-3 rounded-xl
                  ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-200'}
                `}>
                  <CheckIcon />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold truncate ${
                        theme === 'dark' ? 'text-green-300' : 'text-green-800'
                      }`}>
                        {formData.resumeFileName}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          theme === 'dark' ? 'bg-green-700 text-green-200' : 'bg-green-200 text-green-800'
                        }`}>
                          {getFileExtension(formData.resumeFileName)}
                        </span>
                        {formData.resumeFile && (
                          <span className={`text-xs ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-700'
                          }`}>
                            {getFileSize(formData.resumeFile.size)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateFormData({ resumeFile: null, resumeFileName: '' })}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-colors
                        ${theme === 'dark'
                          ? 'bg-gray-700 hover:bg-gray-600 text-red-400'
                          : 'bg-white hover:bg-gray-100 text-red-600'
                        }
                      `}
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {errors.resume && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-500 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.resume}
          </motion.p>
        )}
      </motion.div>

      {/* Cover Letter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <label className={`flex items-center gap-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Cover Letter
          <span className={`text-xs ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
          }`}>(Optional)</span>
        </label>

        <div className="relative">
          <textarea
            id="coverLetter"
            value={formData.coverLetter}
            onChange={(e) => {
              updateFormData({ coverLetter: e.target.value });
              setErrors({ ...errors, coverLetter: '' });
            }}
            placeholder="Tell us why you're a great fit for this role and what excites you about this opportunity..."
            rows={6}
            maxLength={maxCharacters}
            className={`
              w-full px-4 py-4 rounded-xl border-2 transition-all resize-none
              focus:outline-none focus:ring-0
              ${theme === 'dark'
                ? 'bg-gray-800/30 border-gray-600 text-gray-200'
                : 'bg-white border-gray-300 text-gray-900'
              }
              focus:border-blue-500
              ${errors.coverLetter ? 'border-red-500' : ''}
            `}
          />
          
          {/* Character Counter */}
          <div className="flex items-center justify-between mt-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`text-xs ${
                characterCount > maxCharacters * 0.9
                  ? 'text-orange-500'
                  : 'text-gray-500' 
              }`}
            >
              {characterCount} / {maxCharacters} characters
            </motion.p>
            
            {/* Progress Bar */}
            <div className="w-24 h-1.5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(characterPercentage, 100)}%` }}
                className={`h-full transition-colors ${
                  characterPercentage > 90
                    ? 'bg-orange-500'
                    : characterPercentage > 50
                    ? 'bg-blue-500'
                    : 'bg-green-500'
                }`}
              />
            </div>
          </div>
        </div>

        {errors.coverLetter && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500"
          >
            {errors.coverLetter}
          </motion.p>
        )}
      </motion.div>

      {/* Tips */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`
            flex gap-3 p-4 rounded-xl border
            ${theme === 'dark'
              ? 'bg-blue-900/20 border-blue-500/30'
              : 'bg-blue-50 border-blue-200'
            }
          `}
        >
          <svg className={`w-5 h-5 flex-shrink-0 ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Pro Tip
            </p>
            <p className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-blue-300/80' : 'text-blue-900/80'
            }`}>
              A well-written cover letter can increase your chances by up to 40%. Highlight your unique skills and passion!
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`
            flex gap-3 p-4 rounded-xl border
            ${theme === 'dark'
              ? 'bg-gray-800/30 border-gray-700/50'
              : 'bg-gray-50 border-gray-200'
            }
          `}
        >
          <svg className={`w-5 h-5 flex-shrink-0 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Your documents are secure and will only be shared with hiring managers. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
