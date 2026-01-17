import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Users, 
  DollarSign, 
  Building,
  Heart,
  Shield,
  Zap,
  RotateCcw,
  Star,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';

const SimulatorResult = ({ result, scenario, onRestart }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <TrendingDown className="h-5 w-5 text-red-600" />;
  };

  const getImpactIcon = (type) => {
    switch (type) {
      case 'economic': return <DollarSign className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'environmental': return <Building className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getImpactColor = (change) => {
    if (change > 0) return 'text-green-600 bg-green-50';
    if (change < 0) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
            <Award className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Simulation Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Here's how your decisions affected the community
        </p>
      </motion.div>

      {/* Overall Score */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-lg p-6 border border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Overall Performance
          </h3>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              +{result.xpGained} XP
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${getScoreColor(result.overallScore)}`}>
              {result.overallScore}%
            </div>
            <div className="flex items-center justify-center space-x-1">
              {getScoreIcon(result.overallScore)}
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Overall Score
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-2">
              {result.civicStyle}
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Civic Style
              </span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {result.budgetEfficiency}%
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Budget Efficiency
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Categories */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {result.impacts.map((impact, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg ${getImpactColor(impact.change)}`}>
                  {getImpactIcon(impact.category)}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {impact.category.charAt(0).toUpperCase() + impact.category.slice(1)}
                </h4>
              </div>
              <div className="flex items-center space-x-1">
                {impact.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : impact.change < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className={`text-sm font-medium ${getImpactColor(impact.change)}`}>
                  {impact.change > 0 ? '+' : ''}{impact.change}%
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {impact.description}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Detailed Feedback */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Detailed Analysis
        </h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              What Worked Well
            </h4>
            <ul className="space-y-1">
              {result.positives.map((positive, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {positive}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Areas for Improvement
            </h4>
            <ul className="space-y-1">
              {result.improvements.map((improvement, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {improvement}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Badge Achievement */}
      {result.badgeEarned && (
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-6 border border-purple-200 dark:border-purple-700 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
            New Badge Earned!
          </h3>
          <p className="text-purple-800 dark:text-purple-200 font-medium">
            {result.badgeEarned}
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
            {result.badgeDescription}
          </p>
        </motion.div>
      )}

      {/* Learning Points */}
      <motion.div variants={itemVariants} className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Key Learning Points
        </h3>
        <div className="space-y-3">
          {result.learningPoints.map((point, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-1 bg-blue-100 dark:bg-blue-800 rounded-full mt-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {point}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex justify-center space-x-4 pt-6">
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          <RotateCcw className="h-5 w-5" />
          <span>Try Another Scenario</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default SimulatorResult;