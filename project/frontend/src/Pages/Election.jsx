import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { Vote, Users, Calendar, Search, Target, Award, MapPin, Activity, BarChart3, PieChart, BarChart, Download, TrendingUp } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function ElectionsDashboard() {
  const [elections, setElections] = useState([]);
  const [votersData, setVotersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('dashboard');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedElectionType, setSelectedElectionType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/gtfs/elections.json");
        const data = await response.json();
        setElections(data.elections || data);
      } catch (error) {
        console.error('Error loading elections:', error);
      }

      try {
        const response = await fetch("/gtfs/voters.csv");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setVotersData(result.data.filter(row => row['State Name']));
            setLoading(false);
          },
          error: (error) => console.error('Error loading voters:', error)
        });
      } catch (error) {
        console.error('Error loading voters:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const colors = {
    primary: '#059669', secondary: '#10b981', accent: '#34d399', 
    blue: '#3b82f6', purple: '#8b5cf6', orange: '#f59e0b'
  };

  const processedElections = useMemo(() => {
    if (!elections.length) return [];
    return elections.map(election => ({
      ...election,
      date: new Date(election.date),
      year: new Date(election.date).getFullYear(),
      month: new Date(election.date).getMonth()
    }));
  }, [elections]);

  const processedVotersData = useMemo(() => {
    if (!votersData.length) return [];
    return votersData.map(row => ({
      state: row['State Name'],
      constituencyType: row['Constituency Type'],
      seats: parseInt(row['No Of Seats']) || 0,
      totalElectors: parseInt(row['Electors - Total']) || 0,
      maleVoters: parseInt(row['Voters - Male']) || 0,
      femaleVoters: parseInt(row['Voters - Female']) || 0,
      totalVoters: parseInt(row['Voters - Total']) || 0,
      turnout: parseFloat(row['Voters - Poll %']) || 0,
    }));
  }, [votersData]);

  const filteredElections = useMemo(() => {
    let filtered = processedElections;
    if (selectedElectionType !== 'all') {
      filtered = filtered.filter(election => election.type === selectedElectionType);
    }
    if (searchQuery) {
      filtered = filtered.filter(election => 
        election.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        election.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [processedElections, selectedElectionType, searchQuery]);

  const filteredVotersData = useMemo(() => {
    let filtered = processedVotersData;
    if (selectedState !== 'all') {
      filtered = filtered.filter(row => row.state === selectedState);
    }
    return filtered;
  }, [processedVotersData, selectedState]);

  const kpiMetrics = useMemo(() => {
    if (!processedVotersData.length || !processedElections.length) {
      return { totalVoters: 0, avgTurnout: 0, upcomingElections: 0, statesCovered: 0, totalSeats: 0, genderGap: 0 };
    }
    const totalVoters = processedVotersData.reduce((sum, row) => sum + row.totalElectors, 0);
    const avgTurnout = processedVotersData.reduce((sum, row) => sum + row.turnout, 0) / processedVotersData.length;
    const upcomingElections = processedElections.filter(election => election.date > new Date()).length;
    const statesCovered = new Set(processedVotersData.map(row => row.state)).size;
    const totalSeats = processedVotersData.reduce((sum, row) => sum + row.seats, 0);
    const maleVoters = processedVotersData.reduce((sum, row) => sum + row.maleVoters, 0);
    const femaleVoters = processedVotersData.reduce((sum, row) => sum + row.femaleVoters, 0);
    const genderGap = ((maleVoters - femaleVoters) / (maleVoters + femaleVoters)) * 100;
    return { totalVoters, avgTurnout, upcomingElections, statesCovered, totalSeats, genderGap };
  }, [processedVotersData, processedElections]);

  const chartData = useMemo(() => {
    const voterTurnoutData = filteredVotersData
      .filter(row => row.constituencyType === 'Total')
      .sort((a, b) => b.turnout - a.turnout)
      .slice(0, 10)
      .map(row => ({ state: row.state, turnout: row.turnout, totalVoters: row.totalVoters }));

    const genderData = filteredVotersData
      .filter(row => row.constituencyType === 'Total')
      .slice(0, 8)
      .map(row => ({ state: row.state, male: row.maleVoters, female: row.femaleVoters }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const timeline = {};
    filteredElections.forEach(election => {
      const month = months[election.month];
      timeline[month] = (timeline[month] || 0) + 1;
    });
    const timelineData = months.map(month => ({ month, count: timeline[month] || 0 }));

    return { voterTurnoutData, genderData, timelineData };
  }, [filteredVotersData, filteredElections]);

  const KPICard = ({ title, value, icon, color = colors.primary, subtitle, unit = '' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          {React.cloneElement(icon, { className: "w-6 h-6", style: { color } })}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? formatNumber(value) : value}{unit}
      </p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading Electoral Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-green-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Vote className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Elections Dashboard
            </h1>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center">
            <div className="flex bg-green-100 rounded-xl p-1">
              {[
                { key: 'dashboard', label: 'Dashboard', icon: Activity },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                { key: 'insights', label: 'Insights', icon: PieChart }
              ].map((mode) => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.key}
                    onClick={() => setViewMode(mode.key)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      viewMode === mode.key
                        ? 'bg-white text-green-600 shadow-md'
                        : 'text-green-600 hover:text-green-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <KPICard title="Total Voters" value={kpiMetrics.totalVoters} icon={<Users />} subtitle="Registered voters" />
          <KPICard title="Avg Turnout" value={kpiMetrics.avgTurnout.toFixed(1)} unit="%" icon={<Target />} color={colors.secondary} subtitle="Participation rate" />
          <KPICard title="Upcoming Elections" value={kpiMetrics.upcomingElections} icon={<Calendar />} color={colors.blue} subtitle="Scheduled events" />
          <KPICard title="States Covered" value={kpiMetrics.statesCovered} icon={<MapPin />} color={colors.purple} subtitle="Geographic reach" />
          <KPICard title="Total Seats" value={kpiMetrics.totalSeats} icon={<Award />} color={colors.orange} subtitle="Constituencies" />
          <KPICard title="Gender Gap" value={Math.abs(kpiMetrics.genderGap).toFixed(1)} unit="%" icon={<TrendingUp />} color="#ef4444" subtitle="Participation difference" />
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search elections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/80 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedElectionType}
              onChange={(e) => setSelectedElectionType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Election Types</option>
              <option value="Vice-Presidential Election">Vice-Presidential</option>
              <option value="Rajya Sabha Elections">Rajya Sabha</option>
              <option value="State Assembly Election">State Assembly</option>
            </select>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl bg-white/80 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All States</option>
              {Array.from(new Set(processedVotersData.map(row => row.state))).map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            <button
              onClick={() => {
                const csvContent = Papa.unparse(filteredVotersData);
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'electoral-data.csv';
                a.click();
              }}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-200 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Charts */}
        <AnimatePresence mode="wait">
          {viewMode === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top States by Voter Turnout</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={chartData.voterTurnoutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="state" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                    <Bar dataKey="turnout" fill={colors.primary} radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Elections by Month</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={chartData.timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="count" stroke={colors.secondary} strokeWidth={3} dot={{ fill: colors.secondary, r: 4 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          {viewMode === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Gender-wise Voter Participation</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RechartsBarChart data={chartData.genderData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="state" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#6b7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px' }} />
                  <Legend />
                  <Bar dataKey="male" stackId="a" fill={colors.blue} name="Male" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="female" stackId="a" fill="#ec4899" name="Female" radius={[2, 2, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {viewMode === 'insights' && (
            <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <h4 className="font-semibold text-green-800 mb-2">Highest Turnout</h4>
                  <p className="text-sm text-green-700">{chartData.voterTurnoutData[0]?.state || 'N/A'} leads with {chartData.voterTurnoutData[0]?.turnout?.toFixed(1) || 'N/A'}% participation</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                  <h4 className="font-semibold text-blue-800 mb-2">Coverage</h4>
                  <p className="text-sm text-blue-700">{kpiMetrics.statesCovered} states with {formatNumber(kpiMetrics.totalVoters)} registered voters</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                  <h4 className="font-semibold text-purple-800 mb-2">Upcoming</h4>
                  <p className="text-sm text-purple-700">{kpiMetrics.upcomingElections} elections scheduled in the coming months</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Table */}
        <div className="bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl border border-green-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Election Schedule</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-green-100">
                    <th className="text-left py-3 px-4 font-semibold text-green-800">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-green-800">Region</th>
                    <th className="text-left py-3 px-4 font-semibold text-green-800">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-green-800">Event</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredElections.slice(0, 10).map((e, idx) => (
                    <tr key={idx} className="hover:bg-green-50/50 transition-colors border-b border-green-50">
                      <td className="py-3 px-4 text-green-700 font-medium">{e.type}</td>
                      <td className="py-3 px-4 text-gray-700">{e.region}</td>
                      <td className="py-3 px-4 text-gray-700">{e.date.toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-700">{e.event}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}