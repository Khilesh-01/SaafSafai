import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'react-toastify';
import useProfileStatus from '../hooks/useProfileStatus';
import csrfManager from '../utils/csrfManager';
import 'react-toastify/dist/ReactToastify.css';

const ProfileSetup = ({ onComplete }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { refetch } = useProfileStatus();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');
  const [profileSubmitted, setProfileSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || ''
      }));
    }
  }, [user]);

  // Prevent redirect back if profile was just submitted
  useEffect(() => {
    // Store a flag in sessionStorage when profile is submitted
    // This will prevent the Home component from redirecting back
    if (profileSubmitted) {
      sessionStorage.setItem('profileJustSubmitted', 'true');

      // Clear the flag after 5 seconds (after navigation completes)
      setTimeout(() => {
        sessionStorage.removeItem('profileJustSubmitted');
      }, 5000);
    }
  }, [profileSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.location.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      let uploadedProfileUrl = null;

      // If user selected an image, upload it first
      if (profileImageFile) {
        try {
          const fd = new FormData();
          fd.append('image', profileImageFile);
          const uploadRes = await csrfManager.secureFetch(`http://localhost:5000/api/profile/${user.id}/profile-picture`, {
            method: 'POST',
            body: fd
          });

          if (!uploadRes.ok) {
            throw new Error('Failed to upload profile picture');
          }

          const uploadData = await uploadRes.json();
          uploadedProfileUrl = uploadData.profilePictureUrl || null;
          console.log('Profile picture uploaded successfully:', uploadedProfileUrl);
        } catch (uploadError) {
          console.error('Profile picture upload failed:', uploadError);
          toast.warn('Profile picture upload failed, but profile will still be saved');
          // Continue without profile picture
        }
      }

      // Create or update the user profile in our database
      console.log('Saving profile data:', {
        clerkUserId: user.id,
        email: formData.email,
        name: formData.name,
        location: formData.location,
        profilePictureUrl: uploadedProfileUrl
      });

      localStorage.setItem("profileComplete", "true");
      console.log(localStorage.getItem("profileComplete"));
      onComplete();

      const profileResponse = await csrfManager.secureFetch('http://localhost:5000/api/profile/create-or-update', {
        method: 'POST',
        body: JSON.stringify({
          clerkUserId: user.id,
          email: formData.email,
          name: formData.name,
          location: formData.location,
          ...(uploadedProfileUrl ? { profilePictureUrl: uploadedProfileUrl } : {})
        })
      });

      if (!profileResponse.ok) {
        const errorText = await profileResponse.text();
        console.error('Profile save failed:', profileResponse.status, errorText);
        throw new Error(`Failed to save profile: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      console.log('Profile saved successfully:', profileData);

      // Mark profile as submitted to prevent redirect loop
      setProfileSubmitted(true);

      // Force update the profile status to prevent redirect loop
      if (profileData.isProfileComplete) {
        toast.success('Profile setup completed successfully! Redirecting to home page...');

        // Update the profile status hook immediately
        refetch();
        // Use a more reliable redirect method
        setTimeout(() => {
          console.log('Redirecting to home page...');
          // Force a hard redirect to home page
          window.location.replace('/');
        }, 1500);

      } else {
        console.warn('Profile marked as incomplete, but redirecting anyway');
        toast.success('Profile saved! Redirecting to home page...');

        // Update the profile status hook immediately
        refetch();

        // Use a more reliable redirect method
        setTimeout(() => {
          console.log('Redirecting to home page (profile incomplete)...');
          // Force a hard redirect to home page
          window.location.replace('/');
        }, 1500);
      }

    } catch (error) {
      console.error('Profile setup error:', error);

      if (error.message.includes('Failed to save profile')) {
        toast.error('Failed to save profile. Please check your connection and try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setProfileImageFile(null);
      setProfileImagePreview('');
      return;
    }
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setGeolocating(true);
    toast.info('Detecting your location...');

    const options = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0 // Don't use cached position
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('Raw GPS coordinates detected:', { latitude, longitude });

          // Show coordinates in console for debugging
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lonDir = longitude >= 0 ? 'E' : 'W';
          const latAbs = Math.abs(latitude);
          const lonAbs = Math.abs(longitude);
          console.log(`Formatted coordinates: ${latAbs.toFixed(6)}°${latDir}, ${lonAbs.toFixed(6)}°${lonDir}`);

          // Try multiple reverse geocoding services for better accuracy
          let location = '';
          let success = false;
          let serviceUsed = '';

          // Service 1: BigDataCloud with more precise parameters
          try {
            const response1 = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=free&localityLanguage=en&localityInfo=true`
            );

            if (response1.ok) {
              const data = await response1.json();
              console.log('BigDataCloud response:', data);

              if (data.city && data.countryName) {
                location = `${data.city}, ${data.countryName}`;
                success = true;
                serviceUsed = 'BigDataCloud';
              } else if (data.locality && data.countryName) {
                location = `${data.locality}, ${data.countryName}`;
                success = true;
                serviceUsed = 'BigDataCloud';
              } else if (data.countryName) {
                // If only country is available, try to get more specific info
                location = `${data.countryName}`;
                success = true;
                serviceUsed = 'BigDataCloud';
              }
            }
          } catch (error) {
            console.log('BigDataCloud failed:', error);
          }

          // Service 2: OpenStreetMap with better parameters
          if (!success) {
            try {
              const response2 = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=12&accept-language=en&addressdetails=1`
              );

              if (response2.ok) {
                const data = await response2.json();
                console.log('OpenStreetMap response:', data);

                if (data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.county || data.address.state;
                  const country = data.address.country;
                  if (city && country) {
                    location = `${city}, ${country}`;
                    success = true;
                    serviceUsed = 'OpenStreetMap';
                  } else if (country) {
                    location = country;
                    success = true;
                    serviceUsed = 'OpenStreetMap';
                  }
                }
              }
            } catch (error) {
              console.log('OpenStreetMap failed:', error);
            }
          }

          // Service 3: Try a different approach - use coordinates to get nearby cities
          if (!success) {
            try {
              // Use a service that can find nearby cities
              const response3 = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en&key=free&localityInfo=true&radius=50000`
              );

              if (response3.ok) {
                const data = await response3.json();
                console.log('BigDataCloud with radius response:', data);

                if (data.city && data.countryName) {
                  location = `${data.city}, ${data.countryName}`;
                  success = true;
                  serviceUsed = 'BigDataCloud (radius)';
                }
              }
            } catch (error) {
              console.log('BigDataCloud radius search failed:', error);
            }
          }

          // If all services fail, use coordinates with better formatting
          if (!success) {
            // Try to get a more human-readable coordinate format
            location = `${latAbs.toFixed(6)}°${latDir}, ${lonAbs.toFixed(6)}°${lonDir}`;
            serviceUsed = 'Coordinates only';
          }

          setFormData(prev => ({ ...prev, location }));

          // Show detailed success message
          if (success) {
            toast.success(`Location detected via ${serviceUsed}: ${location}`);
            console.log(`Location successfully detected via ${serviceUsed}: ${location}`);
          } else {
            toast.info(`Using coordinates: ${location}`);
            console.log(`Using fallback coordinates: ${location}`);
          }

          // Additional debugging: Check if coordinates are reasonable for Bangalore
          // Bangalore is roughly around: 12.9716°N, 77.5946°E
          const bangaloreLat = 12.9716;
          const bangaloreLon = 77.5946;
          const distance = Math.sqrt(
            Math.pow(latitude - bangaloreLat, 2) + Math.pow(longitude - bangaloreLon, 2)
          );

          if (distance < 0.1) { // Within ~11km of Bangalore center
            console.log('✅ Coordinates are close to Bangalore center');
          } else if (distance < 0.5) { // Within ~55km of Bangalore center
            console.log('⚠️ Coordinates are within Bangalore metropolitan area');
          } else {
            console.log('❌ Coordinates seem far from Bangalore center');
            console.log(`Distance from Bangalore center: ${(distance * 111).toFixed(1)} km`);
          }

        } catch (error) {
          console.error('Reverse geocoding error:', error);
          // Ultimate fallback to coordinates
          const { latitude, longitude } = position.coords;
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lonDir = longitude >= 0 ? 'E' : 'W';
          const latAbs = Math.abs(latitude);
          const lonAbs = Math.abs(longitude);

          const fallbackLocation = `${latAbs.toFixed(6)}°${latDir}, ${lonAbs.toFixed(6)}°${lonDir}`;
          setFormData(prev => ({ ...prev, location: fallbackLocation }));
          toast.info(`Using coordinates: ${fallbackLocation}`);
          console.log(`Fallback coordinates: ${fallbackLocation}`);
        } finally {
          setGeolocating(false);
        }
      },
      (error) => {
        setGeolocating(false);
        console.error('Geolocation error:', error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location permission denied. Please enable location access in your browser settings and refresh the page.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable. Please check your internet connection and try again.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out. Please try again.');
            break;
          default:
            toast.error('Unable to detect location. Please enter your location manually.');
        }
      },
      options
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20">
        <div className="text-center p-8 rounded-2xl bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-800/30 shadow-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to continue with your profile setup
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20 py-6 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-green-400/10 via-transparent to-emerald-400/10 dark:from-green-400/5 dark:to-emerald-400/5"></div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 rounded-2xl mb-8 shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-emerald-800 dark:from-white dark:via-gray-200 dark:to-emerald-300 bg-clip-text text-transparent mb-4">
            Complete Your Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
            Let's personalize your <span className="font-semibold text-emerald-600 dark:text-emerald-400">saafsafai</span> experience with a few essential details
          </p>
        </div>

        {/* Form Card */}
        <div className="relative">
          {/* Card Background with Glass Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/60 to-green-50/60 dark:from-gray-900/40 dark:via-gray-800/60 dark:to-emerald-900/20 rounded-3xl backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-3xl"></div>

          {/* Main Card */}
          <div className="relative bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-800/30 p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide">
                  Full Name <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200/80 dark:border-gray-700/80 rounded-2xl bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-base font-medium group-hover:border-gray-300 dark:group-hover:border-gray-600"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide">
                  Email Address <span className="text-emerald-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-5 py-4 border-2 border-gray-200/80 dark:border-gray-700/80 rounded-2xl bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-base font-medium group-hover:border-gray-300 dark:group-hover:border-gray-600"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Location Field */}
              <div className="group">
                <label htmlFor="location" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide">
                  Location <span className="text-emerald-500">*</span>
                </label>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200/80 dark:border-gray-700/80 rounded-2xl bg-white/80 dark:bg-gray-900/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/20 transition-all duration-300 text-base font-medium group-hover:border-gray-300 dark:group-hover:border-gray-600"
                      placeholder="Enter your city or location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={geolocating}
                    className="relative overflow-hidden px-8 py-4 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white rounded-2xl font-bold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center justify-center whitespace-nowrap">
                      {geolocating ? (
                        <>
                          <svg className="animate-spin w-5 h-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Detecting
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Auto-Locate
                        </>
                      )}
                    </div>
                  </button>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">
                  Click "Auto-Locate" for instant location detection, or type your location manually
                </p>
              </div>

              {/* Profile Picture Field */}
              <div className="group">
                <label htmlFor="profileImage" className="block text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 tracking-wide">
                  Profile Picture
                  <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">Optional</span>
                </label>
                <div className="space-y-5">
                  <div className="relative">
                    <input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-700 dark:text-gray-200 
                                file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 
                                file:text-sm file:font-bold file:bg-gradient-to-r file:from-emerald-50 file:to-green-50 
                                file:text-emerald-700 hover:file:from-emerald-100 hover:file:to-green-100
                                dark:file:from-emerald-900/30 dark:file:to-green-900/30 dark:file:text-emerald-300 
                                dark:hover:file:from-emerald-800/40 dark:hover:file:to-green-800/40
                                file:transition-all file:duration-300 file:shadow-lg hover:file:shadow-xl
                                file:cursor-pointer cursor-pointer
                                border-2 border-dashed border-gray-200 dark:border-gray-700 
                                rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-600
                                transition-all duration-300"
                      onChange={handleImageChange}
                    />
                  </div>
                  {profileImagePreview && (
                    <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
                      <div className="relative">
                        <img
                          src={profileImagePreview}
                          alt="Profile preview"
                          className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-xl ring-4 ring-emerald-500/20"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        <p className="font-bold text-base mb-1">Perfect! 📸</p>
                        <p className="text-gray-600 dark:text-gray-400">Your profile picture is ready to upload</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-6 h-6 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="tracking-wide">Setting up your profile...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="tracking-wide">Complete Profile Setup</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Progress Indicator */}
            <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-700/60">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse delay-100"></div>
                <div className="w-3 h-3 bg-emerald-300 rounded-full animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-0 w-16 h-16 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default ProfileSetup;