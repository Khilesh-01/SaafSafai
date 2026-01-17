import React, { useState } from 'react';
import { Bell, Check, X, AlertTriangle, Info, Users, FileText, Settings, Clock, ChevronDown, Home, BarChart3, ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'urgent',
      title: 'System Maintenance Required',
      message: 'Critical security update needs to be applied to the voting system.',
      timestamp: '2 minutes ago',
      read: false,
      icon: AlertTriangle,
      category: 'system'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Citizen Registration',
      message: '15 new citizens have registered for upcoming municipal elections.',
      timestamp: '5 minutes ago',
      read: false,
      icon: Users,
      category: 'registration'
    },
    {
      id: 3,
      type: 'success',
      title: 'Vote Count Verified',
      message: 'District 7 vote count has been successfully verified and approved.',
      timestamp: '10 minutes ago',
      read: true,
      icon: Check,
      category: 'voting'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Low Voter Turnout Alert',
      message: 'Current turnout is 23% below expected levels for Ward 3.',
      timestamp: '15 minutes ago',
      read: false,
      icon: AlertTriangle,
      category: 'analytics'
    },
    {
      id: 5,
      type: 'info',
      title: 'Campaign Document Submitted',
      message: 'John Mitchell has submitted financial disclosure documents.',
      timestamp: '1 hour ago',
      read: true,
      icon: FileText,
      category: 'documents'
    },
    {
      id: 6,
      type: 'info',
      title: 'System Update Complete',
      message: 'Database backup and system optimization completed successfully.',
      timestamp: '2 hours ago',
      read: true,
      icon: Settings,
      category: 'system'
    }
  ]);

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const getTypeStyles = (type) => {
    switch (type) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:hover:bg-yellow-950/50';
      case 'success':
        return 'border-l-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:hover:bg-green-950/50';
      default:
        return 'border-l-emerald-500 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50';
    }
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admin/notifications');

  const getIconColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'success':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-emerald-600 dark:text-emerald-400';
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100">
      {/* Sidebar (unchanged) */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-green-100 text-emerald-600 lg:hidden"
        style={{ display: isSidebarOpen ? 'none' : 'block' }}
      ><ChevronRight className="w-6 h-6" /></button>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out border-r border-green-100 flex flex-col shadow-xl bg-white
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'}`}>
        <div className="relative flex items-center justify-between p-4 border-b border-green-100">
          <div className={`flex items-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            {isSidebarOpen && (
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">saafsafai</span>
            )}
          </div>
          <button
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg hover:bg-green-100 transition-all duration-200 ${!isSidebarOpen ? 'mx-auto' : ''}`}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-green-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-green-600" />
            )}
          </button>
        </div>
        {isSidebarOpen && (
          <div className="p-4 border-b border-green-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-green-50 rounded-lg text-sm border-0 focus:ring-2 focus:ring-emerald-300 text-green-900 placeholder-green-500"
              />
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
                  className={`
                    w-full flex items-center py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                    ${isSidebarOpen ? '' : 'justify-center'}
                    ${isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                      : 'text-green-800 hover:bg-green-100 hover:text-green-900 hover:shadow-md'
                    }
                  `}
                  onClick={() => { setActiveRoute(item.route); navigate(item.route); }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-10 rounded-xl" />}
                  <div className="relative z-10 flex items-center">
                    <Icon className={`w-5 h-5 transition-all duration-200 ${isSidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-white' : 'text-green-600'}`} />
                    {isSidebarOpen && <span className="relative z-10">{item.label}</span>}
                  </div>
                </button>
              </div>
            );
          })}
        </nav>
      </aside>
      {/* Main Notifications UI */}
      <div className="mx-auto max-w-3xl pt-8 px-2 lg:ml-64">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 mb-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-green-200 to-emerald-100 p-3 rounded-xl">
                <Bell className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Notifications</h1>
                <p className="text-green-600">System alerts and platform updates</p>
              </div>
            </div>
            <div>
              {unreadCount > 0 && (
                <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">{unreadCount} new</span>
              )}
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex bg-green-50 p-1 rounded-xl gap-1">
              {['all', 'unread', 'read'].map(tab => (
                <button key={tab}
                  className={`px-5 py-2 rounded-lg text-sm capitalize font-semibold transition
                  ${filter === tab
                      ? 'bg-emerald-700 text-white shadow'
                      : 'text-green-800 hover:bg-emerald-100'
                    }`}
                  onClick={() => setFilter(tab)}>
                  {tab}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button className="ml-4 flex items-center gap-1 text-emerald-700 hover:underline text-sm font-semibold"
                onClick={markAllAsRead}>
                <Check className="h-4 w-4" /> Mark all as read
              </button>
            )}
          </div>
          {/* Notification Cards */}
          <div className="space-y-4 mt-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-24 text-green-700 text-lg font-medium">No notifications right now.</div>
            ) : (
              filteredNotifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div key={notif.id}
                    className={`rounded-xl p-5 shadow-sm transition border bg-white flex ${getTypeStyles(notif.type)} ${notif.read ? 'opacity-70' : 'shadow-md'}`}>
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg mr-6
                      bg-gradient-to-br from-green-100 to-emerald-100">
                      <Icon className={`h-6 w-6 ${getIconColor(notif.type)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <h3 className={`font-semibold text-lg ${notif.read ? 'text-green-600' : 'text-green-900'}`}>{notif.title}</h3>
                        {!notif.read && <span className="w-2 h-2 ml-2 inline-block rounded-full bg-emerald-500" />}
                      </div>
                      <div className={`mb-2 text-sm ${notif.read ? 'text-green-700' : 'text-green-800'}`}>{notif.message}</div>
                      <div className="flex items-center gap-3 text-xs text-green-700 font-medium mt-1">
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{notif.timestamp}</span>
                        <span className={`px-2 py-1 rounded-full ${notif.category === 'system'
                          ? 'bg-blue-100 text-blue-900'
                          : notif.category === 'analytics'
                            ? 'bg-yellow-100 text-yellow-900'
                            : notif.category === 'registration'
                              ? 'bg-emerald-100 text-green-900'
                              : notif.category === 'voting'
                                ? 'bg-cyan-100 text-cyan-900'
                                : 'bg-green-50 text-green-800'}`}>{notif.category}</span>
                      </div>
                    </div>
                    <div className="ml-3 flex flex-col gap-1 items-center justify-center">
                      {!notif.read && (
                        <button title="Mark as read"
                          onClick={() => markAsRead(notif.id)}
                          className="hover:bg-green-100 rounded-md p-2 text-green-700 hover:text-emerald-900">
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      <button title="Delete"
                        onClick={() => deleteNotification(notif.id)}
                        className="hover:bg-red-100 rounded-md p-2 text-red-600 hover:text-red-700">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          <div className="pt-6 text-center text-sm text-green-600">Showing {filteredNotifications.length} of {notifications.length} notifications</div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
