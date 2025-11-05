'use client';

import { motion } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { useState, useRef } from 'react';

export const ResumeStep = () => {
  const { formData, updateFormData } = useFormStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.resumeFile) {
      newErrors.resume = 'Please upload your resume';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (typeof window !== 'undefined') {
    (window as { __validateResume?: () => boolean }).__validateResume = validate;
  }

  const handleFile = (file: File) => {
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
      setErrors({ resume: 'Please upload a PDF or Word document' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setErrors({ resume: 'File size must be less than 5MB' });
      return;
    }

    updateFormData({ 
      resumeFile: file,
      resumeFileName: file.name,
    });
    setErrors({});
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* File Upload Area */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`relative p-8 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          dragActive
            ? 'border-blue-500 bg-blue-900/20'
            : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
        }`}
        onClick={() => fileInputRef.current?.click()}
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
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`text-4xl mb-3 ${dragActive ? 'animate-pulse' : ''}`}
          >
            📄
          </motion.div>
          
          <p className="text-sm font-medium mb-1 text-gray-200">
            {formData.resumeFile ? 'Resume uploaded' : 'Drop your resume here'}
          </p>
          
          <p className="text-xs text-gray-400">
            or click to browse (PDF, DOC, DOCX • up to 5MB)
          </p>
        </div>
      </motion.div>

      {errors.resume && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-500"
        >
          ⚠️ {errors.resume}
        </motion.p>
      )}

      {/* Resume Preview */}
      {formData.resumeFile && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 rounded-lg border-l-4 border-green-500 bg-green-900/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-gray-200">✓ {formData.resumeFileName}</p>
              <p className="text-xs mt-1 text-green-400">
                Ready to submit
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => updateFormData({ resumeFile: null, resumeFileName: '' })}
              className="text-sm font-medium px-3 py-1 rounded bg-red-900/50 text-red-300 hover:bg-red-900/70"
            >
              Remove
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Cover Letter */}
      <div className="space-y-2">
        <label
          htmlFor="coverLetter"
          className="block text-sm font-medium transition-colors text-gray-200"
        >
          Cover Letter (Optional)
        </label>
        <textarea
          id="coverLetter"
          placeholder="Tell us why you're a great fit for this role..."
          value={formData.coverLetter}
          onChange={(e) => updateFormData({ coverLetter: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:border-blue-500 resize-none bg-gray-700 border-gray-600 text-white"
        />
        <p className="text-xs text-gray-400">
          {formData.coverLetter.length}/500 characters
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-3 rounded-lg bg-blue-900/20 border border-blue-800 text-blue-300"
      >
        <p className="text-sm">
          💡 A strong cover letter increases your chances by 30%
        </p>
      </motion.div>
    </motion.div>
  );
};
