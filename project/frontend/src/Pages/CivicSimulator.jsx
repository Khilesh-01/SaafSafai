import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  Users, 
  DollarSign, 
  Award, 
  RotateCcw, 
  TrendingUp, 
  Shield,
  Heart,
  Lightbulb,
  Target,
  Star,
  Clock,
  ChevronRight,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ScenarioCard from '../components/ScenarioCard';
import SimulatorResult from '../components/SimulatorResult';
import { calculateResults, getRandomScenario } from '../utils/SimulatorLogic';

const CivicSimulator = () => {
  const [currentScenario, setCurrentScenario] = useState(null);
  const [userDecisions, setUserDecisions] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);
  const [userProfile, setUserProfile] = useState({
    xp: 0,
    level: 1,
    badges: [],
    civicStyle: 'Newcomer',
    completedScenarios: []
  });
  const [showResult, setShowResult] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [simulationHistory, setSimulationHistory] = useState([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('civicSimulatorProfile');
    const savedHistory = localStorage.getItem('civicSimulatorHistory');
    
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedHistory) {
      setSimulationHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save data to localStorage whenever profile or history changes
  useEffect(() => {
    localStorage.setItem('civicSimulatorProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('civicSimulatorHistory', JSON.stringify(simulationHistory));
  }, [simulationHistory]);

  const startNewSimulation = () => {
    const scenario = getRandomScenario(selectedDifficulty);
    setCurrentScenario(scenario);
    setUserDecisions({});
    setSimulationResult(null);
    setShowResult(false);
  };

  const handleDecisionChange = (decisionKey, value) => {
    setUserDecisions(prev => ({
      ...prev,
      [decisionKey]: value
    }));
  };

  const submitDecisions = () => {
    const result = calculateResults(currentScenario, userDecisions);
    setSimulationResult(result);
    setShowResult(true);
    
    // Update user profile
    const newXP = userProfile.xp + result.xpGained;
    const newLevel = Math.floor(newXP / 100) + 1;
    const newBadges = [...userProfile.badges];
    
    // Check for new badges
    if (result.badgeEarned && !newBadges.includes(result.badgeEarned)) {
      newBadges.push(result.badgeEarned);
    }
    
    const updatedProfile = {
      ...userProfile,
      xp: newXP,
      level: newLevel,
      badges: newBadges,
      civicStyle: result.civicStyle,
      completedScenarios: [...userProfile.completedScenarios, currentScenario.id]
    };
    
    setUserProfile(updatedProfile);
    
    // Add to simulation history
    const historyEntry = {
      id: Date.now(),
      scenario: currentScenario,
      decisions: userDecisions,
      result: result,
      timestamp: new Date().toISOString(),
      difficulty: selectedDifficulty
    };
    
    setSimulationHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
  };

  const resetSimulation = () => {
    setCurrentScenario(null);
    setUserDecisions({});
    setSimulationResult(null);
    setShowResult(false);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                <Home className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-2">
                <Building className="h-6 w-6 text-emerald-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Civic Simulator</h1>
              </div>
            </div>
            
            {/* User Profile Summary */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-900 rounded-full px-3 py-1">
                <Star className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                  Level {userProfile.level}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  {userProfile.xp} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-8"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Civic Simulator
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience real civic dilemmas and learn about the complexities of public decision-making. 
              Make choices, see consequences, and develop your civic leadership skills.
            </p>
          </motion.div>

          {/* Stats Dashboard */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Civic Style</p>
                  <p className="text-2xl font-bold text-emerald-600">{userProfile.civicStyle}</p>
                </div>
                <Users className="h-8 w-8 text-emerald-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Scenarios Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{userProfile.completedScenarios.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Badges Earned</p>
                  <p className="text-2xl font-bold text-purple-600">{userProfile.badges.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Level</p>
                  <p className="text-2xl font-bold text-orange-600">{userProfile.level}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Simulator */}
            <div className="lg:col-span-2">
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <AnimatePresence mode="wait">
                  {!currentScenario ? (
                    <motion.div
                      key="start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center py-12"
                    >
                      <Building className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to Start?
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Choose your difficulty level and begin a civic simulation
                      </p>
                      
                      {/* Difficulty Selection */}
                      <div className="flex justify-center space-x-4 mb-8">
                        {['easy', 'medium', 'hard'].map((difficulty) => (
                          <button
                            key={difficulty}
                            onClick={() => setSelectedDifficulty(difficulty)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              selectedDifficulty === difficulty
                                ? 'bg-emerald-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                          </button>
                        ))}
                      </div>
                      
                      <motion.button
                        onClick={startNewSimulation}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center space-x-2 mx-auto"
                      >
                        <Lightbulb className="h-5 w-5" />
                        <span>Start New Simulation</span>
                      </motion.button>
                    </motion.div>
                  ) : showResult ? (
                    <SimulatorResult
                      result={simulationResult}
                      scenario={currentScenario}
                      onRestart={resetSimulation}
                    />
                  ) : (
                    <ScenarioCard
                      scenario={currentScenario}
                      userDecisions={userDecisions}
                      onDecisionChange={handleDecisionChange}
                      onSubmit={submitDecisions}
                      difficulty={selectedDifficulty}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Right Column - Profile & History */}
            <div className="space-y-6">
              {/* Badges */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 text-emerald-600 mr-2" />
                  Achievements
                </h3>
                {userProfile.badges.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {userProfile.badges.map((badge, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-900 rounded-lg p-2">
                        <Star className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-emerald-800 dark:text-emerald-200">{badge}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Complete simulations to earn badges!
                  </p>
                )}
              </motion.div>

              {/* Recent History */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  Recent Simulations
                </h3>
                {simulationHistory.length > 0 ? (
                  <div className="space-y-3">
                    {simulationHistory.slice(0, 3).map((entry, index) => (
                      <div key={entry.id} className="border-l-4 border-emerald-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {entry.scenario.title}
                          </h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(entry.difficulty)}`}>
                            {entry.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          +{entry.result.xpGained} XP • {new Date(entry.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No simulations completed yet.
                  </p>
                )}
              </motion.div>

              {/* Progress Bar */}
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Level Progress
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Level {userProfile.level}</span>
                    <span className="text-gray-600 dark:text-gray-300">
                      {userProfile.xp % 100}/100 XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(userProfile.xp % 100)}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CivicSimulator;