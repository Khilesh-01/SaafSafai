import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Star, 
  X, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const VotingFeedbackModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  pollTitle 
}) => {
  const [formData, setFormData] = useState({
    category: "voting_experience",
    rating: 0,
    feedback: "",
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({});

  // Different emojis for rating
  const emojis = ["😡", "😞", "😐", "🙂", "🤩"];

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (formData.rating === 0) {
      newErrors.rating = "Please rate your experience";
    }

    if (!formData.feedback.trim()) {
      newErrors.feedback = "Please provide your feedback";
    } else if (formData.feedback.trim().length > 500) {
      newErrors.feedback = "Feedback must be less than 500 characters";
    }

    // Optional fields with validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          category: "voting_experience",
          rating: 0,
          feedback: "",
          name: "",
          email: "",
          phone: ""
        });
        setErrors({});
        setTouched({});
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };



  const isFieldValid = (field) => {
    return touched[field] && !errors[field] && formData[field];
  };

  const isFieldInvalid = (field) => {
    return touched[field] && errors[field];
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
        >
          {!submitted ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mr-3">
                    <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      How was your voting experience?
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Help us improve our voting system
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Poll Info */}
              {pollTitle && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">You just voted on:</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    "{pollTitle}"
                  </p>
                </div>
              )}

              {/* Personal Information Section */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Personal Information (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium">
                      Full Name
                      <span className="text-gray-400 ml-1">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition ${
                          isFieldValid('name') ? 'border-green-500' : ''
                        } ${isFieldInvalid('name') ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                      />
                      {isFieldValid('name') && (
                        <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </motion.div>

                  {/* Email */}
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <label className="block text-sm font-medium">
                      Email Address
                      <span className="text-gray-400 ml-1">(optional)</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition ${
                          isFieldValid('email') ? 'border-green-500' : ''
                        } ${isFieldInvalid('email') ? 'border-red-500' : ''}`}
                        placeholder="Enter your email address"
                      />
                      {isFieldValid('email') && (
                        <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                      )}
                      {isFieldInvalid('email') && (
                        <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {isFieldInvalid('email') && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </motion.div>
                </div>

                {/* Phone */}
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium">
                    Phone Number
                    <span className="text-gray-400 ml-1">(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition ${
                        isFieldValid('phone') ? 'border-green-500' : ''
                      } ${isFieldInvalid('phone') ? 'border-red-500' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {isFieldValid('phone') && (
                      <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                    )}
                    {isFieldInvalid('phone') && (
                      <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {isFieldInvalid('phone') && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </motion.div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700 mb-6" />

              {/* Feedback Details Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Feedback Details</h4>
                
                {/* Category */}
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium">
                    What would you like to feedback on?
                  </label>
                  <div className="relative">
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition"
                    >
                      <option value="voting_experience">Voting Experience</option>
                      <option value="poll_questions">Poll Questions</option>
                      <option value="user_interface">User Interface</option>
                      <option value="performance">Performance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </motion.div>

                {/* Emoji Rating */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Rate Your Experience
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="flex gap-4 mt-1 justify-between">
                    {emojis.map((emoji, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleInputChange('rating', index + 1)}
                        whileTap={{ scale: 0.8, rotate: -10 }}
                        animate={
                          formData.rating === index + 1
                            ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] }
                            : { scale: 1, rotate: 0 }
                        }
                        transition={{ duration: 0.4 }}
                        className={`w-14 h-14 rounded-full border flex items-center justify-center text-2xl transition-all shadow-md ${
                          formData.rating === index + 1
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                        } ${isFieldInvalid('rating') ? 'border-red-500' : ''}`}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                  {isFieldInvalid('rating') && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.rating}
                    </p>
                  )}
                </div>

                {/* Feedback */}
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium">
                    Your Feedback
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => handleInputChange('feedback', e.target.value)}
                      onBlur={() => handleBlur('feedback')}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 transition ${
                        isFieldValid('feedback') ? 'border-green-500' : ''
                      } ${isFieldInvalid('feedback') ? 'border-red-500' : ''}`}
                      rows="4"
                      placeholder="Please share your detailed feedback, suggestions, or concerns..."
                      maxLength={500}
                    />
                    {isFieldValid('feedback') && (
                      <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                    )}
                    {isFieldInvalid('feedback') && (
                      <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    {isFieldInvalid('feedback') && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.feedback}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 ml-auto">
                      {formData.feedback.length}/500 characters
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="mt-6">
                <button
                  onClick={handleSubmit}
                  disabled={formData.rating === 0 || !formData.feedback.trim()}
                  className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Send className="w-4 h-4" />
                  Submit Feedback
                </button>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Thank you for your feedback!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your input helps us improve the voting experience for everyone.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VotingFeedbackModal;
