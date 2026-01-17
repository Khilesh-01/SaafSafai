import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  Building, 
  Zap, 
  Heart,
  Shield,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const ScenarioCard = ({ scenario, userDecisions, onDecisionChange, onSubmit, difficulty }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showImpact, setShowImpact] = useState(false);

  const handleSliderChange = (key, value) => {
    onDecisionChange(key, value);
    setShowImpact(true);
  };

  const handleToggleChange = (key, value) => {
    onDecisionChange(key, value);
    setShowImpact(true);
  };

  const calculateBudgetUsed = () => {
    return Object.values(userDecisions).reduce((sum, value) => {
      if (typeof value === 'number') {
        return sum + value;
      }
      return sum;
    }, 0);
  };

  const budgetUsed = calculateBudgetUsed();
  const remainingBudget = scenario.budget - budgetUsed;
  const isOverBudget = remainingBudget < 0;

  const canSubmit = () => {
    const hasAllDecisions = scenario.decisions.every(decision => 
      userDecisions[decision.key] !== undefined
    );
    return hasAllDecisions && !isOverBudget;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactIcon = (type) => {
    switch (type) {
      case 'economic': return <DollarSign className="h-4 w-4" />;
      case 'social': return <Users className="h-4 w-4" />;
      case 'environmental': return <Building className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getImpactColor = (level) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {scenario.title}
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {scenario.description}
        </p>
        
        {/* Budget Display */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <span className="font-medium text-gray-900 dark:text-white">
              Total Budget: ${scenario.budget.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <div className={`font-semibold ${isOverBudget ? 'text-red-600' : 'text-emerald-600'}`}>
              Remaining: ${remainingBudget.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Used: ${budgetUsed.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Context */}
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Background
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              {scenario.context}
            </p>
          </div>
        </div>
      </div>

      {/* Decisions */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Make Your Decisions
        </h3>
        
        {scenario.decisions.map((decision, index) => (
          <motion.div
            key={decision.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {decision.title}
              </h4>
              {decision.type === 'budget' && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Max: ${decision.max.toLocaleString()}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {decision.description}
            </p>

            {decision.type === 'budget' ? (
              <div className="space-y-3">
                <input
                  type="range"
                  min={decision.min}
                  max={decision.max}
                  step={decision.step || 1000}
                  value={userDecisions[decision.key] || decision.min}
                  onChange={(e) => handleSliderChange(decision.key, Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    ${decision.min.toLocaleString()}
                  </span>
                  <span className="font-medium text-emerald-600">
                    ${(userDecisions[decision.key] || decision.min).toLocaleString()}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    ${decision.max.toLocaleString()}
                  </span>
                </div>
              </div>
            ) : decision.type === 'boolean' ? (
              <div className="flex items-center space-x-4">
                {decision.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleToggleChange(decision.key, option.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      userDecisions[decision.key] === option.value
                        ? 'bg-emerald-600 text-white shadow-lg scale-105'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {decision.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleToggleChange(decision.key, option.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                      userDecisions[decision.key] === option.value
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Real-time Impact Preview */}
      {showImpact && userDecisions && Object.keys(userDecisions).length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 border border-purple-200 dark:border-purple-700"
        >
          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-3 flex items-center">
            <Zap className="h-4 w-4 mr-2" />
            Potential Impact Preview
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {scenario.impacts && scenario.impacts.map((impact, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`p-1 rounded ${getImpactColor(impact.level)}`}>
                  {getImpactIcon(impact.type)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {impact.category}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {impact.level} impact
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {isOverBudget && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Over budget by ${Math.abs(remainingBudget).toLocaleString()}</span>
            </div>
          )}
          {canSubmit() && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Ready to submit</span>
            </div>
          )}
        </div>
        
        <motion.button
          onClick={onSubmit}
          disabled={!canSubmit()}
          whileHover={canSubmit() ? { scale: 1.05 } : {}}
          whileTap={canSubmit() ? { scale: 0.95 } : {}}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            canSubmit()
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Submit Decisions
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScenarioCard;