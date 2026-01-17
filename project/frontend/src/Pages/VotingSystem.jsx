import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Vote,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import VotingFeedbackModal from '../components/voting/VotingFeedbackModal';
import toast from 'react-hot-toast';

const VotingSystem = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [polls, setPolls] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newOptions, setNewOptions] = useState('');
  const [votedPolls, setVotedPolls] = useState(new Set());
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentPollForFeedback, setCurrentPollForFeedback] = useState(null);

  const handleVote = (pollId, optionIndex) => {
    if (votedPolls.has(pollId)) return;
    setPolls(prev =>
      prev.map(p =>
        p.id === pollId
          ? {
            ...p,
            votes: p.votes.map((v, i) =>
              i === optionIndex ? v + 1 : v
            )
          }
          : p
      )
    );
    setVotedPolls(prev => new Set([...prev, pollId]));
    setCurrentPollForFeedback(polls.find(p => p.id === pollId));
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    toast.success('Thank you for your feedback!');
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    const options = newOptions.split('\n').map(o => o.trim()).filter(Boolean);
    if (!newTitle.trim() || options.length < 2) return;

    setPolls(prev => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle,
        options,
        votes: Array(options.length).fill(0)
      }
    ]);

    setNewTitle('');
    setNewOptions('');
    setActiveTab('browse');
  };

  const totalVotes = poll => poll.votes.reduce((a, b) => a + b, 0);
  const percent = (v, t) => (t ? Math.round((v / t) * 100) : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-indigo-950 dark:via-slate-900 dark:to-violet-950">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <motion.div className="text-center mb-14">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-xl flex items-center justify-center mb-6">
            <Vote className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
            Poll System
          </h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            Create polls, vote securely, and view insights.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded-2xl shadow-xl mb-10 overflow-hidden">
          <div className="flex">
            {[
              { id: 'browse', label: 'Browse', icon: Vote },
              { id: 'create', label: 'Create', icon: Plus },
              { id: 'results', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-6 font-semibold flex items-center justify-center gap-2 transition
                  ${activeTab === tab.id
                    ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300'
                    : 'text-gray-500 hover:text-violet-600 dark:hover:text-violet-300'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 rounded-2xl shadow-2xl p-8">

          {/* Browse */}
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {polls.length === 0 ? (
                <p className="text-center text-gray-500">No polls yet.</p>
              ) : polls.map(poll => {
                const total = totalVotes(poll);
                const voted = votedPolls.has(poll.id);

                return (
                  <div
                    key={poll.id}
                    className="p-6 rounded-xl border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-white to-violet-50 dark:from-slate-900 dark:to-violet-950"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      {poll.title}
                    </h3>

                    {!voted ? (
                      <div className="grid gap-3">
                        {poll.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleVote(poll.id, i)}
                            className="px-5 py-3 rounded-lg border border-violet-300 dark:border-violet-700 hover:bg-violet-100 dark:hover:bg-violet-900 transition"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      poll.options.map((opt, i) => {
                        const v = poll.votes[i];
                        const pct = percent(v, total);
                        return (
                          <div key={i} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{opt}</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="h-2 bg-violet-100 dark:bg-violet-900 rounded">
                              <div
                                className="h-2 bg-gradient-to-r from-violet-600 to-indigo-600 rounded"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Create */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreatePoll} className="space-y-6 max-w-xl mx-auto">
              <input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Poll question"
                className="w-full p-4 rounded-xl border border-violet-300 dark:border-violet-700 bg-white dark:bg-violet-950"
              />
              <textarea
                rows={5}
                value={newOptions}
                onChange={e => setNewOptions(e.target.value)}
                placeholder="Each option on new line"
                className="w-full p-4 rounded-xl border border-violet-300 dark:border-violet-700 bg-white dark:bg-violet-950"
              />
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold">
                Create Poll
              </button>
            </form>
          )}

          {/* Analytics */}
          {activeTab === 'results' && (
            <p className="text-center text-gray-500">
              Analytics will appear after voting.
            </p>
          )}
        </div>
      </div>

      <VotingFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        pollTitle={currentPollForFeedback?.title}
      />
    </div>
  );
};

export default VotingSystem;
