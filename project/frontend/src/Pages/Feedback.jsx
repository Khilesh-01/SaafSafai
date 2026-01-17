import { useState } from "react";
import {
  Send,
  MessageSquare,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const Feedback = () => {
  const [formData, setFormData] = useState({
    category: "",
    rating: 0,
    feedback: "",
    name: "",
    email: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const { category, rating, feedback, name, email, phone } = formData;
  const emojis = ["😡", "😞", "😐", "🙂", "🤩"];

  const validateForm = () => {
    const e = {};
    if (!category) e.category = "Please select a category";
    if (!rating) e.rating = "Please rate your experience";
    if (!feedback.trim()) e.feedback = "Feedback is required";
    else if (feedback.length < 10) e.feedback = "Minimum 10 characters";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (f, v) => {
    setFormData(p => ({ ...p, [f]: v }));
    if (errors[f]) setErrors(p => ({ ...p, [f]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFormData({ category: "", rating: 0, feedback: "", name: "", email: "", phone: "" });
      setTouched({});
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-indigo-950 dark:via-slate-900 dark:to-violet-950 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-600 blur-lg opacity-25 rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-r from-violet-600 to-indigo-600 p-4 rounded-full shadow-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
            Share Your Experience
          </h1>

          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Your feedback helps improve civic services.
          </p>
        </div>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 space-y-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-violet-200 dark:border-violet-700 shadow-2xl"
          >

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["name", "email", "phone"].map((field) => (
                <div key={field}>
                  <label className="text-sm font-medium capitalize">
                    {field} {field !== "name" && "(optional)"}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-violet-300 dark:border-violet-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              ))}
            </div>

            <hr className="border-violet-200 dark:border-violet-700" />

            {/* Category */}
            <div>
              <label className="text-sm font-medium">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg border border-violet-300 dark:border-violet-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select --</option>
                <option value="governance">Governance</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="health">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                  <AlertCircle className="w-4 h-4" /> {errors.category}
                </p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="text-sm font-medium">
                Rate Experience <span className="text-red-500">*</span>
              </label>
              <div className="flex justify-center gap-3 mt-2 p-4 rounded-2xl bg-violet-50 dark:bg-slate-900 border border-violet-200 dark:border-violet-700">
                {emojis.map((emoji, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleChange("rating", i + 1)}
                    className={`w-14 h-14 text-2xl rounded-xl transition ${rating === i + 1
                        ? "bg-indigo-600 text-white shadow-lg"
                        : "bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700"
                      }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            {/* Feedback */}
            <div>
              <label className="text-sm font-medium">
                Feedback <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  rows={4}
                  maxLength={500}
                  value={feedback}
                  onChange={(e) => handleChange("feedback", e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-violet-300 dark:border-violet-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500"
                />
                <Sparkles className="absolute bottom-2 right-2 text-slate-400 w-5 h-5" />
              </div>
              <div className="flex justify-between text-sm mt-1">
                {errors.feedback && <span className="text-red-500">{errors.feedback}</span>}
                <span className="text-slate-500">{feedback.length}/500</span>
              </div>
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-10 rounded-3xl text-center bg-white/90 dark:bg-slate-800 border border-violet-300 dark:border-violet-700 shadow-2xl"
          >
            <p className="text-4xl">🎉</p>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
              Thank You!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Your feedback has been submitted successfully.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-6 px-6 py-2 rounded-xl border border-violet-300 dark:border-violet-700 hover:bg-violet-50 dark:hover:bg-slate-700 transition"
            >
              Submit Another
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feedback;
