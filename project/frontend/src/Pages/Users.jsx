import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, User, Users, Mail, Phone, MapPin, Calendar, Shield, AlertTriangle, CheckCircle, XCircle, Edit, Ban, UserX, Eye, Home, BarChart3, Bell, Settings, ChevronRight, ChevronLeft, FileText } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admin/users');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const usersPerPage = 10;

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          credentials: 'include'
        });
        if (response.ok) {
          const usersData = await response.json();
          // Transform the data to match the expected format
          const transformedUsers = usersData.map(user => ({
            id: user._id,
            clerkUserId: user.clerkUserId,
            name: user.name || 'N/A',
            email: user.email,
            phone: 'N/A', // Phone not stored in current schema
            location: user.location || 'N/A',
            joinDate: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A',
            lastActive: 'N/A', // Not tracked currently
            status: 'active', // Default status
            role: user.role,
            posts: 0, // Not tracked
            comments: 0, // Not tracked
            votes: 0, // Not tracked
            avatar: user.profilePictureUrl,
            verified: user.isProfileComplete || false,
            reputation: 4.0 // Default
          }));
          setUsers(transformedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    if (dropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [dropdownOpen]);

  // Filtering, paging
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const promoteUser = async (user) => {
    try {
      const response = await fetch(`http://localhost:5000/api/profile/${user.clerkUserId || user.id}/promote`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (response.ok) {
        // Update the user in the local state
        setUsers(prev => prev.map(u =>
          u.id === user.id ? { ...u, role: 'admin' } : u
        ));
        alert('User promoted to admin successfully!');
      } else {
        alert('Failed to promote user');
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      alert('Error promoting user');
    }
    setDropdownOpen(null);
  };
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(user => user.id));
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <XCircle className="h-4 w-4 text-gray-400" />;
      case 'suspended': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'moderator': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'citizen': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const UserModal = ({ user, onClose }) => {
    if (!user) return null;
    return (
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold ">User Details</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold ">{user.name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(user.status)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">{user.status}</span>
                  {user.verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4 mr-2" />
                      {user.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      {user.location}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Details</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {user.joinDate}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Stats</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Posts Created</span>
                      <span className="font-medium ">{user.posts}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Comments</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user.comments}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Votes Cast</span>
                      <span className="font-medium">{user.votes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Reputation</span>
                      <span className="font-medium ">{user.reputation}/5.0</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Activity</label>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{user.lastActive}</p>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </button>
              <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                <Ban className="h-4 w-4 mr-2" />
                Suspend
              </button>
              <button className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center">
                <UserX className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen ml-0 lg:ml-10 bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100 text-green-900">
      {/* Sidebar toggle and sidebar menu remain unchanged */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-50 text-emerald-600 lg:hidden"
        style={{ display: isSidebarOpen ? 'none' : 'block' }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out backdrop-blur-xl border-r border-gray-200/50 flex flex-col shadow-xl 
      ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'}`}
      >
        {/* Sidebar and navigation logic UNCHANGED */}
        <div className="relative flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
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
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${!isSidebarOpen ? 'mx-auto' : ''
              }`}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
        {isSidebarOpen && (
          <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
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
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 transform scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-md'
                    }
                `}
                  onClick={() => navigate(item.route)}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-10 rounded-xl" />
                  )}
                  <div className="relative z-10 flex items-center">
                    <Icon
                      className={`w-5 h-5 transition-all duration-200 ${isSidebarOpen ? 'mr-3' : ''
                        } ${isActive
                          ? 'text-white'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                        }`}
                    />
                    {isSidebarOpen && (
                      <span className="relative z-10 transition-all duration-300">
                        {item.label}
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </div>
            );
          })}
        </nav>
      </aside>
      {/* ---- Main user management UI with fresh green look ---- */}
      <div className="shadow-sm border-b border-green-200 bg-gradient-to-r from-green-100 to-green-50/50">
        <div className="px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700">Users Management</h1>
            <p className="text-green-600 mt-1">Manage platform users and their permissions</p>
          </div>
          <button className="bg-emerald-700 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg shadow font-medium">Add New User</button>
        </div>
      </div>
      <div className="px-8 py-6">
        <div className="rounded-xl shadow mb-6 border border-green-100 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50">
            {/* Search/filters */}
            <div className="flex flex-col sm:flex-row flex-1 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-green-100 rounded-lg bg-green-50 text-emerald-900 focus:ring-2 focus:ring-green-300"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border border-green-100 rounded-lg px-4 py-2 bg-green-50 text-emerald-900 focus:ring-2 focus:ring-green-300"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="border border-green-100 rounded-lg px-4 py-2 bg-green-50 text-emerald-900 focus:ring-2 focus:ring-green-300"
              >
                <option value="all">All Roles</option>
                <option value="citizen">Citizens</option>
                <option value="moderator">Moderators</option>
                <option value="admin">Admins</option>
              </select>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="text-green-700">{selectedUsers.length} selected</span>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm">Suspend</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm">Delete</button>
              </div>
            )}
          </div>
        </div>
        {/* User Table */}
        <div className="rounded-xl shadow border border-green-100 overflow-hidden bg-white">
          <table className="w-full text-left min-w-max">
            <thead className="bg-gradient-to-r from-green-100 to-green-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onChange={handleSelectAll}
                    className="accent-green-600"
                  />
                </th>
                <th className="px-6 py-3 text-xs font-semibold">User</th>
                <th className="px-6 py-3 text-xs font-semibold">Contact</th>
                <th className="px-6 py-3 text-xs font-semibold">Role</th>
                <th className="px-6 py-3 text-xs font-semibold">Status</th>
                <th className="px-6 py-3 text-xs font-semibold">Activity</th>
                <th className="px-6 py-3 text-xs font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-50">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-green-50 transition">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="accent-green-600"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-green-700">{user.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{user.email}</div>
                    <div className="text-xs text-green-700">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {getStatusIcon(user.status)}
                      <span className="ml-2 text-xs">{user.status}</span>
                      {user.verified && <CheckCircle className="h-4 w-4 text-blue-500 ml-1" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">{user.posts} posts</div>
                    <div className="text-xs text-green-700">Last: {user.lastActive}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setDropdownOpen(dropdownOpen === user.id ? null : user.id)}
                          className="text-green-400 hover:text-emerald-700"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {dropdownOpen === user.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => promoteUser(user)}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Shield className="inline h-4 w-4 mr-2" />
                                  Promote to Admin
                                </button>
                              )}
                              <button
                                onClick={() => setDropdownOpen(null)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="inline h-4 w-4 mr-2" />
                                Edit User
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
            <div className="text-xs text-green-800">
              Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded text-xs bg-green-100 text-green-800 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-xs text-green-800">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded text-xs bg-green-100 text-green-800 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal unchanged except for green style */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;
