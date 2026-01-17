import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  MapPin,
  AlertTriangle,
  Clock,
  Edit3,
  Save,
  Lock,
  CheckCircle
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import useProfileStatus from '../hooks/useProfileStatus';
import { toast } from 'react-hot-toast';
import csrfManager from '../utils/csrfManager';

const Profile = () => {
  const { user: clerkUser } = useUser();
  const { profileData, isLoading, refetch } = useProfileStatus();
  const [user, setUser] = useState({
    username: '',
    email: '',
    location: '',
    complaints: 0,
    lastActivity: '',
  });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    location: '',
  });
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordRequest, setShowPasswordRequest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      const userData = {
        username: profileData.name || '',
        email: profileData.email || '',
        location: profileData.location || '',
        complaints: 7,
        lastActivity: new Date().toLocaleString(),
      };
      setUser(userData);
      setFormData({
        username: userData.username,
        email: userData.email,
        location: userData.location,
      });
    }
  }, [profileData]);

  const validate = () => {
    const tempErrors = {};
    if (!formData.username.trim()) {
      tempErrors.username = 'Name is required';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      tempErrors.email = 'Invalid email format';
    }
    if (!formData.location.trim()) {
      tempErrors.location = 'Location is required';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = async () => {
    if (!clerkUser) {
      toast.error('You must be logged in to update your profile');
      return;
    }
    if (!validate()) {
      toast.error('Please fix the validation errors before saving');
      return;
    }
    setIsSaving(true);
    try {
      const profileResponse = await csrfManager.secureFetch('http://localhost:5000/api/profile/create-or-update', {
        method: 'POST',
        body: JSON.stringify({
          clerkUserId: clerkUser.id,
          email: formData.email,
          name: formData.username,
          location: formData.location
        })
      });
      if (!profileResponse.ok) {
        throw new Error('Failed to update profile');
      }
      const updatedProfile = await profileResponse.json();
      setUser({
        ...user,
        username: formData.username,
        email: formData.email,
        location: formData.location,
      });
      refetch();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordRequest = () => {
    setShowPasswordRequest(true);
    setTimeout(() => setShowPasswordRequest(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-green-50/40 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.08)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(52,211,153,0.06)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent"></div>

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Modern card with glass morphism */}
          <div className="bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-emerald-50/20 pointer-events-none"></div>

            {/* Modern header with enhanced design */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 px-8 py-10">
              {/* Header background pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08)_0%,transparent_50%)]"></div>

              <div className="relative z-10 flex items-center gap-6">
                {isLoading ? (
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl">
                      <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                    <div className="absolute -inset-2 bg-white/10 rounded-3xl blur-md"></div>
                  </div>
                ) : profileData?.profilePictureUrl ? (
                  <div className="relative">
                    <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/40 shadow-2xl">
                      <img
                        src={profileData.profilePictureUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -inset-2 bg-white/10 rounded-3xl blur-md"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/30 shadow-2xl">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -inset-2 bg-white/10 rounded-3xl blur-md"></div>
                  </div>
                )}
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-1 drop-shadow-sm">
                    {isLoading ? 'Loading...' : user.username || 'User'}
                  </h1>
                  <p className="text-emerald-50/90 text-lg font-medium drop-shadow-sm">
                    {isLoading ? '...' : user.email}
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 border border-white/20 rounded-full"></div>
              <div className="absolute bottom-4 right-8 w-8 h-8 border border-white/20 rounded-full"></div>
            </div>

            {/* Content area */}
            <div className="relative z-10 p-8">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 border-4 border-emerald-100 rounded-full blur-sm"></div>
                  </div>
                  <p className="ml-4 text-emerald-700 font-semibold text-lg">Loading profile data...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Form fields with modern styling */}
                  <div className="grid gap-6">
                    {/* Name Field */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                        <div className="p-2 rounded-xl bg-emerald-100/60">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.username}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all duration-300 text-lg font-medium ${isEditing
                              ? 'border-emerald-200 bg-white text-slate-900 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 shadow-lg hover:shadow-xl'
                              : 'border-slate-200/50 bg-slate-50/50 text-slate-600 shadow-sm'
                            }`}
                        />
                        {isEditing && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/5 to-green-400/5 pointer-events-none"></div>
                        )}
                      </div>
                      {errors.username && (
                        <p className="text-red-500 text-sm font-medium flex items-center gap-2 px-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.username}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                        <div className="p-2 rounded-xl bg-blue-100/60">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all duration-300 text-lg font-medium ${isEditing
                              ? 'border-emerald-200 bg-white text-slate-900 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 shadow-lg hover:shadow-xl'
                              : 'border-slate-200/50 bg-slate-50/50 text-slate-600 shadow-sm'
                            }`}
                        />
                        {isEditing && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/5 to-green-400/5 pointer-events-none"></div>
                        )}
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm font-medium flex items-center gap-2 px-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Location Field */}
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 text-sm font-bold text-slate-700 uppercase tracking-wide">
                        <div className="p-2 rounded-xl bg-purple-100/60">
                          <MapPin className="w-4 h-4 text-purple-600" />
                        </div>
                        Location
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.location}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className={`w-full px-6 py-4 rounded-2xl border-2 outline-none transition-all duration-300 text-lg font-medium ${isEditing
                              ? 'border-emerald-200 bg-white text-slate-900 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 shadow-lg hover:shadow-xl'
                              : 'border-slate-200/50 bg-slate-50/50 text-slate-600 shadow-sm'
                            }`}
                        />
                        {isEditing && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/5 to-green-400/5 pointer-events-none"></div>
                        )}
                      </div>
                      {errors.location && (
                        <p className="text-red-500 text-sm font-medium flex items-center gap-2 px-2">
                          <AlertTriangle className="w-4 h-4" />
                          {errors.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 bg-red-100 rounded-xl">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="text-sm font-bold text-red-700 uppercase tracking-wide">Total Complaints</span>
                        </div>
                        <div className="text-3xl font-bold text-red-700">{user.complaints}</div>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                      <div className="relative bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2.5 bg-emerald-100 rounded-xl">
                            <Clock className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span className="text-sm font-bold text-emerald-700 uppercase tracking-wide">Last Active</span>
                        </div>
                        <div className="text-sm font-semibold text-emerald-700 leading-tight">
                          {user.lastActivity || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-200/50">
                    {isEditing ? (
                      <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="relative group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center gap-3">
                          {isSaving ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Save Changes
                            </>
                          )}
                        </div>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="relative group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10 flex items-center gap-3">
                          <Edit3 className="w-5 h-5" />
                          Edit Profile
                        </div>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handlePasswordRequest}
                      className="relative group flex items-center justify-center gap-3 px-8 py-4 bg-white/80 text-emerald-700 rounded-2xl font-bold text-lg border-2 border-emerald-200 shadow-md hover:shadow-lg hover:bg-emerald-50 transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10 flex items-center gap-3">
                        <Lock className="w-5 h-5" />
                        Change Password
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Password Reset Success Message */}
              {showPasswordRequest && (
                <div className="mt-6 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-2xl blur-md"></div>
                  <div className="relative bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6 flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="p-2 bg-emerald-100 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-emerald-800 font-bold text-lg">Success!</p>
                      <p className="text-emerald-700 font-medium">Password reset link sent to your email address</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;