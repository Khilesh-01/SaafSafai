import React, { useState } from "react";
import { Shield, Eye, Lock, Users, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Privacy() {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: "collection",
      icon: <Eye className="w-6 h-6" />,
      title: "Information Collection",
      preview: "We collect information you provide directly...",
      content:
        "We collect information you provide directly, such as when you report issues or contact support. We may also collect location data to better route civic complaints to the appropriate local authorities and ensure your reports reach the right departments efficiently.",
    },
    {
      id: "usage",
      icon: <FileText className="w-6 h-6" />,
      title: "Use of Information",
      preview: "Your data helps us improve our service...",
      content:
        "The collected information is used to improve our service quality, route reports to appropriate authorities, provide users with real-time updates and support, and analyze trends to better serve your community's needs.",
    },
    {
      id: "security",
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      preview: "We implement robust security measures...",
      content:
        "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your data. However, no method of transmission over the internet is 100% secure, and we continuously work to enhance our security protocols.",
    },
    {
      id: "third-party",
      icon: <Users className="w-6 h-6" />,
      title: "Third-Party Services",
      preview: "Your privacy is our priority...",
      content:
        "We do not sell your information to third parties. However, we may share necessary data with trusted government partners and verified service providers to ensure our civic services function effectively and your reports reach the appropriate authorities.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden font-sans">
      {/* Decorative background blobs - slightly adjusted colors for better contrast */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-blob-1"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/20 dark:bg-cyan-400/10 rounded-full blur-3xl animate-blob-2"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-8 shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-500">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent mb-6 pb-3">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy outlines how{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              saafsafai
            </span>{" "}
            collects, uses, and protects your information when you use our
            services.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6 mb-16">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-gray-200/40 dark:border-gray-700/40 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl text-white shadow-md transition-all duration-500 ${expandedSection === section.id
                        ? "bg-gradient-to-br from-indigo-500 to-blue-500 scale-110 rotate-12"
                        : "bg-gradient-to-br from-purple-500 to-fuchsia-600"
                      }`}
                  >
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {section.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {section.preview}
                    </p>
                  </div>
                </div>
                <div
                  className={`text-indigo-500 transition-transform duration-300 ${expandedSection === section.id ? "rotate-180" : "rotate-0"
                    }`}
                >
                  {expandedSection === section.id ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>

              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6">
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border-l-4 border-indigo-500 shadow-inner">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Policy Updates Section - improved gradient and shadows */}
        <div className="bg-gradient-to-r from-indigo-500 to-cyan-600 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>
          <div className="relative flex items-start space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">Changes to This Policy</h3>
              <p className="text-indigo-50 leading-relaxed mb-4">
                We may update this policy periodically to reflect changes in our
                practices or for legal compliance. Continued use of our services
                constitutes your agreement to these changes.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm shadow-inner-white">
                <span className="text-sm font-medium">
                  Last updated: August 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200/70 dark:border-gray-700/70 transform hover:scale-105 transition-all duration-300">
            <span className="text-gray-600 dark:text-gray-400">
              Questions about our privacy policy?
            </span>
            <a
              href="/contact"
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Privacy;