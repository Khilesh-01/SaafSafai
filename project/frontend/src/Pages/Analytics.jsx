import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Users, FileText, MessageCircle, TrendingUp, Calendar, MapPin, Award, AlertCircle, Home, BarChart3, Bell, Settings, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";


const Analytics = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admin/analytics');

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const userGrowthData = [
    { month: 'Jan', users: 1200, active: 850 },
    { month: 'Feb', users: 1450, active: 980 },
    { month: 'Mar', users: 1800, active: 1200 },
    { month: 'Apr', users: 2100, active: 1450 },
    { month: 'May', users: 2650, active: 1800 },
    { month: 'Jun', users: 3200, active: 2200 },
  ];

  const engagementData = [
    { day: 'Mon', posts: 45, comments: 120, votes: 89 },
    { day: 'Tue', posts: 52, comments: 145, votes: 95 },
    { day: 'Wed', posts: 38, comments: 98, votes: 78 },
    { day: 'Thu', posts: 61, comments: 165, votes: 112 },
    { day: 'Fri', posts: 48, comments: 132, votes: 87 },
    { day: 'Sat', posts: 35, comments: 89, votes: 65 },
    { day: 'Sun', posts: 29, comments: 76, votes: 54 },
  ];

  const categoryData = [
    { name: 'Local Issues', value: 35, color: '#059669' },
    { name: 'Elections', value: 28, color: '#10b981' },
    { name: 'Policy Discussion', value: 22, color: '#34d399' },
    { name: 'Community Events', value: 15, color: '#6ee7b7' },
  ];

  const recentActivity = [
    { type: 'new_post', user: 'Sarah Chen', action: 'created a post about local transportation', time: '2 minutes ago' },
    { type: 'comment', user: 'Mike Johnson', action: 'commented on school funding discussion', time: '5 minutes ago' },
    { type: 'vote', user: 'Emma Davis', action: 'voted on parking ordinance proposal', time: '8 minutes ago' },
    { type: 'new_user', user: 'Alex Rivera', action: 'joined the platform', time: '12 minutes ago' },
  ];

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="rounded-lg shadow-sm border border-green-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1 truncate">{value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 ${trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`} />
            <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {change} from last week
            </span>
          </div>
        </div>
        <div className="p-3 bg-green-50 rounded-full">
          <Icon className="h-6 w-6 text-green-600" />
        </div>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/50 ml-0 lg:ml-10">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 text-emerald-600 lg:hidden"
        style={{ display: isSidebarOpen ? 'none' : 'block' }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <aside className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'}`}>
        <div className="relative flex items-center justify-between p-4 border-b border-gray-200/50">
          <div className={`flex items-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            {isSidebarOpen && (
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                saafsafai
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${!isSidebarOpen ? 'mx-auto' : ''}`}
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5 text-gray-600" /> : <ChevronRight className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
        {isSidebarOpen && (
          <div className="p-4 border-b border-gray-200/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
          </div>
        )}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const isActive = item.route === activeRoute;
            const Icon = item.icon;
            return (
              <div key={item.key} className="relative group">
                <button
                  type="button"
                  className={`w-full flex items-center py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                    ${isSidebarOpen ? '' : 'justify-center'}
                    ${isActive ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'}
                  `}
                  onClick={() => navigate(item.route)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-10 rounded-xl" />}
                  <div className="relative z-10 flex items-center">
                    <Icon className={`w-5 h-5 transition-all duration-200 ${isSidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-emerald-600'}`} />
                    {isSidebarOpen && <span className="relative z-10 transition-all duration-300">{item.label}</span>}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="backdrop-blur-sm bg-white/80 border-b border-green-100/50 shadow-sm">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-emerald-700 bg-clip-text text-transparent">Analytics Dashboard</h1>
              <p className="text-slate-600 mt-2">Monitor platform engagement and community growth</p>
            </div>
            <div className="flex items-center space-x-4">
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="backdrop-blur-sm bg-white/90 border border-emerald-200/60 rounded-xl px-4 py-2.5 text-slate-700 focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 shadow-sm">
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
              <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-5 py-2.5 rounded-xl transition-all duration-200 text-white font-medium shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value="3,247" change="+12.5%" trend="up" icon={Users} />
          <StatCard title="Active Posts" value="1,582" change="+8.2%" trend="up" icon={FileText} />
          <StatCard title="Comments" value="4,891" change="+15.7%" trend="up" icon={MessageCircle} />
          <StatCard title="Civic Actions" value="892" change="+22.1%" trend="up" icon={Award} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">User Growth</h3>
              <div className="flex items-center space-x-6 text-sm mt-2 sm:mt-0">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 shadow-sm"></div>
                  <span className="text-slate-600">Total Users</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-2 shadow-sm"></div>
                  <span className="text-slate-600">Active Users</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #d1fae5', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="users" stroke="#059669" fill="url(#totalGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="active" stroke="#34d399" fill="url(#activeGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Discussion Categories</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={100} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3 shadow-sm" style={{ backgroundColor: category.color }}></div>
                    <span className="text-sm text-slate-600 font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Weekly Engagement</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #d1fae5', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                <Bar dataKey="posts" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="votes" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Activity</h3>
              <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">View All</button>
            </div>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-emerald-50/60 to-green-50/40 rounded-xl border border-emerald-100/30 hover:shadow-md transition-all duration-200">
                  <div className="flex-shrink-0 p-2 bg-white/80 rounded-lg border border-emerald-200/50">
                    {activity.type === 'new_post' && <FileText className="h-4 w-4 text-emerald-600" />}
                    {activity.type === 'comment' && <MessageCircle className="h-4 w-4 text-emerald-600" />}
                    {activity.type === 'vote' && <Award className="h-4 w-4 text-emerald-600" />}
                    {activity.type === 'new_user' && <Users className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-800"><span className="font-semibold">{activity.user}</span> {activity.action}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6 hover:shadow-2xl hover:shadow-green-200/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-green-500/20 rounded-xl mr-4">
                <MapPin className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Geographic Reach</p>
                <p className="text-2xl font-bold text-slate-800">47 Cities</p>
                <p className="text-sm text-emerald-600 font-medium">+3 new this month</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6 hover:shadow-2xl hover:shadow-green-200/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500/10 to-green-500/20 rounded-xl mr-4">
                <Calendar className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Scheduled Events</p>
                <p className="text-2xl font-bold text-slate-800">23</p>
                <p className="text-sm text-emerald-600 font-medium">Next: Town Hall</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-green-100/50 shadow-xl shadow-green-100/20 p-6 hover:shadow-2xl hover:shadow-amber-200/30 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-amber-500/10 to-orange-500/20 rounded-xl mr-4">
                <AlertCircle className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Moderation Queue</p>
                <p className="text-2xl font-bold text-slate-800">8</p>
                <p className="text-sm text-amber-600 font-medium">Requires attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Analytics;
