'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useFormStore } from '@/lib/store';
import { useState } from 'react';
import { useMobile } from '@/hooks/useMobile';
import type { Application } from '@/lib/store';

interface ApplicationCardProps {
  application: Application;
  theme: 'light' | 'dark';
  isMobile: boolean;
}

const ApplicationCard = ({ application, theme, isMobile }: ApplicationCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { updateApplicationStatus } = useFormStore();

  const { formData, submittedAt, status } = application;
  const submittedDate = new Date(submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const submittedTime = new Date(submittedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const statusColors = {
    pending: theme === 'dark' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
    reviewed: theme === 'dark' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-50 text-blue-700 border-blue-200',
    accepted: theme === 'dark' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-green-50 text-green-700 border-green-200',
    rejected: theme === 'dark' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border backdrop-blur-xl overflow-hidden ${
        theme === 'dark'
          ? 'bg-gray-800/50 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Card Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 sm:p-6 text-left transition-colors ${
          theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className={`text-lg sm:text-xl font-bold truncate ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {formData.fullName}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border w-fit ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            
            <div className={`space-y-1 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <p className="truncate">{formData.currentRole} • {formData.yearsOfExperience} years</p>
              <p className="truncate">{formData.location}</p>
              <p className="text-xs">{submittedDate} at {submittedTime}</p>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <svg className={`w-6 h-6 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </button>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`border-t overflow-hidden ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="p-4 sm:p-6 space-y-6">
              {/* Contact Information */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Information
                </h4>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div>
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${formData.email}`} className={`block truncate ${
                      theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                    }`}>
                      {formData.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Phone:</span>
                    <p className="truncate">{formData.phone}</p>
                  </div>
                  {formData.linkedIn && (
                    <div>
                      <span className="font-medium">LinkedIn:</span>
                      <a href={`https://${formData.linkedIn}`} target="_blank" rel="noopener noreferrer" className={`block truncate ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}>
                        {formData.linkedIn}
                      </a>
                    </div>
                  )}
                  {formData.portfolio && (
                    <div>
                      <span className="font-medium">Portfolio:</span>
                      <a href={`https://${formData.portfolio}`} target="_blank" rel="noopener noreferrer" className={`block truncate ${
                        theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                      }`}>
                        {formData.portfolio}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience Details */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Experience & Preferences
                </h4>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {formData.company && (
                    <div>
                      <span className="font-medium">Company:</span>
                      <p>{formData.company}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Availability:</span>
                    <p className="capitalize">{formData.availability}</p>
                  </div>
                  <div>
                    <span className="font-medium">Work Preference:</span>
                    <p className="capitalize">{formData.remote}</p>
                  </div>
                  {formData.salary && (
                    <div>
                      <span className="font-medium">Salary Expectation:</span>
                      <p>{formData.salary}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Cover Letter */}
              {formData.coverLetter && (
                <div>
                  <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Cover Letter
                  </h4>
                  <p className={`text-sm leading-relaxed whitespace-pre-line ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {formData.coverLetter}
                  </p>
                </div>
              )}

              {/* Resume */}
              <div>
                <h4 className={`text-sm font-semibold mb-3 flex items-center gap-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Resume
                </h4>
                <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                  theme === 'dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {formData.resumeFileName}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              }">
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateApplicationStatus(application.id, 'reviewed')}
                  disabled={status === 'reviewed' || status === 'accepted' || status === 'rejected'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Mark as Reviewed
                </motion.button>
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateApplicationStatus(application.id, 'accepted')}
                  disabled={status === 'accepted' || status === 'rejected'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Accept
                </motion.button>
                <motion.button
                  whileHover={isMobile ? {} : { scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateApplicationStatus(application.id, 'rejected')}
                  disabled={status === 'accepted' || status === 'rejected'}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  Reject
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const HiringManagerView = () => {
  const { applications, theme } = useFormStore();
  const isMobile = useMobile();
  const [filter, setFilter] = useState<'all' | Application['status']>('all');

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter((app) => app.status === filter);

  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === 'pending').length,
    reviewed: applications.filter((app) => app.status === 'reviewed').length,
    accepted: applications.filter((app) => app.status === 'accepted').length,
    rejected: applications.filter((app) => app.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Hiring Manager Dashboard
        </h2>
        <p className={`text-base sm:text-lg ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Review and manage job applications
        </p>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4"
      >
        {[
          { label: 'Total', value: stats.total, color: 'blue' },
          { label: 'Pending', value: stats.pending, color: 'yellow' },
          { label: 'Reviewed', value: stats.reviewed, color: 'purple' },
          { label: 'Accepted', value: stats.accepted, color: 'green' },
          { label: 'Rejected', value: stats.rejected, color: 'red' },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`p-4 rounded-xl border backdrop-blur-xl ${
              theme === 'dark'
                ? 'bg-gray-800/50 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <p className={`text-2xl sm:text-3xl font-bold mb-1 ${
              theme === 'dark' 
                ? `text-${stat.color}-500`
                : stat.label === 'Accepted' 
                  ? 'text-green-600' 
                  : 'text-gray-900'
            }`}>
              {stat.value}
            </p>
            <p className={`text-xs sm:text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-900'
            }`}>
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((status) => (
          <motion.button
            key={status}
            whileHover={isMobile ? {} : { scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status as typeof filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-blue-600 text-white shadow-lg'
                : theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* Applications List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredApplications.length === 0 ? (
          <div className={`p-12 rounded-2xl border backdrop-blur-xl text-center ${
            theme === 'dark'
              ? 'bg-gray-800/50 border-gray-700'
              : 'bg-white border-gray-200'
          }`}>
            <svg className={`w-16 h-16 mx-auto mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              No applications found
            </h3>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {filter === 'all'
                ? 'No applications have been submitted yet.'
                : `No ${filter} applications at this time.`}
            </p>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              theme={theme}
              isMobile={isMobile}
            />
          ))
        )}
      </motion.div>
    </div>
  );
};
