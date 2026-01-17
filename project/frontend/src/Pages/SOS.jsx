import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Shield, AlertTriangle, Heart, Car, Home, Users, ChevronRight, Copy, Check, Zap, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SOSPage = () => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [copiedNumber, setCopiedNumber] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationError('');
        },
        () => setLocationError('Unable to retrieve location. Please enable location services.')
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => { getLocation(); }, []);

  const emergencyNumbers = [
    { name: 'Police Emergency', number: '100', icon: Shield, color: 'from-blue-500 to-blue-700', description: 'Police assistance and law enforcement' },
    { name: 'Fire Emergency', number: '101', icon: AlertTriangle, color: 'from-red-500 to-red-700', description: 'Fire department and rescue services' },
    { name: 'Medical Emergency / Ambulance', number: '108', icon: Heart, color: 'from-emerald-500 to-emerald-700', description: 'Ambulance and medical emergency' },
    { name: 'Women Helpline', number: '1091', icon: Users, color: 'from-purple-500 to-purple-700', description: '24x7 helpline for women in distress' },
    { name: 'Child Helpline', number: '1098', icon: Users, color: 'from-pink-500 to-pink-700', description: 'Child protection and assistance' },
    { name: 'Disaster Management (NDRF)', number: '1078', icon: Car, color: 'from-orange-500 to-orange-700', description: 'National disaster response force emergency helpline' },
    { name: 'Road Accident Emergency', number: '1073', icon: Car, color: 'from-yellow-500 to-yellow-700', description: 'Emergency response for road accidents' },
    { name: 'Railway Helpline', number: '139', icon: Home, color: 'from-indigo-500 to-indigo-700', description: 'Railway protection force & train inquiry helpline' },
    { name: 'Gas Leakage Emergency', number: '1906', icon: AlertTriangle, color: 'from-teal-500 to-teal-700', description: 'Emergency helpline for LPG gas leakage' },
    { name: 'Senior Citizens Helpline', number: '14567', icon: Users, color: 'from-gray-500 to-gray-700', description: 'Helpline dedicated to assisting senior citizens' },
    { name: 'Mental Health Helpline', number: '1800-599-0019', icon: Heart, color: 'from-rose-500 to-rose-700', description: 'Support for mental health and suicide prevention (KIRAN Helpline)' },
  ];

  const navigate = useNavigate();

  const quickActions = [
    { name: 'Send Location to Emergency Contact', action: () => shareLocation(), icon: Send, color: 'from-indigo-500 to-indigo-700' }
  ];

  const callEmergencyNumber = (number) => { /* No-op for design */ };

  const copyToClipboard = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(''), 2000);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = number;
      document.body.appendChild(textArea);
      textArea.select(); document.execCommand('copy'); document.body.removeChild(textArea);
      setCopiedNumber(number);
      setTimeout(() => setCopiedNumber(''), 2000);
    }
  };

  const shareLocation = () => {
    if (location) {
      const locationText = `Emergency! My current location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
      if (navigator.share) {
        navigator.share({ title: 'Emergency Location', text: locationText });
      } else {
        copyToClipboard(locationText);
        alert('Location copied to clipboard!');
      }
    } else {
      alert('Location not available. Please enable location services.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950">
      {/* Header */}
      <header className="relative bg-gradient-to-r from-red-600 via-rose-700 to-rose-600 text-white shadow-2xl rounded-b-3xl">
        <div className="absolute inset-0 bg-black/10 backdrop-blur"></div>
        <div className="relative px-6 py-10 sm:py-14">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto gap-7">
            <div className="flex items-center gap-4">
              <span className="relative inline-flex">
                <span className="absolute inset-0 bg-white/30 rounded-full blur-md"></span>
                <span className="relative p-3 rounded-full border border-white/10 bg-white/10">
                  <AlertTriangle className="h-11 w-11" />
                </span>
              </span>
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-rose-100 bg-clip-text text-transparent tracking-tight drop-shadow">
                  Emergency SOS
                </h1>
                <p className="text-rose-100 text-lg mt-1 font-medium tracking-wide">Help is available 24/7 • Stay Safe</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 -mt-2 md:mt-0 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 text-rose-100">
                <Clock className="h-5 w-5" />
                <span className="text-base font-semibold">Current Time</span>
              </div>
              <div className="text-2xl md:text-3xl px-4 py-2 font-mono bg-white/10 border border-white/20 backdrop-blur rounded-lg font-bold">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto md:px-10 px-4 py-12 space-y-10 max-w-7xl">
        {/* Location */}
        <section className="bg-white/90 dark:bg-slate-900/80 shadow-xl rounded-2xl border border-emerald-100 dark:border-slate-700 backdrop-blur-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 p-3 rounded-full shadow">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Location</h2>
          </div>
          {location ? (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/60 dark:border-emerald-800 rounded-xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 dark:bg-emerald-900 rounded-lg p-2">
                  <MapPin className="h-5 w-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-800 dark:text-emerald-200">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300">
                    Accuracy: ±{Math.round(location.accuracy)} meters
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-2 flex-wrap">
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${location.latitude},${location.longitude}`, '_blank')}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow transition hover:scale-105"
                >
                  <MapPin className="h-4 w-4" />View on Map
                </button>
                <button
                  onClick={shareLocation}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-700 hover:to-indigo-900 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow transition hover:scale-105"
                >
                  <Send className="h-4 w-4" />Share Location
                </button>
              </div>
            </div>
          ) : locationError ? (
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-amber-100 dark:border-amber-800 rounded-xl p-6 flex flex-col gap-4">
              <span className="text-amber-800 dark:text-amber-200 font-medium">{locationError}</span>
              <button
                onClick={getLocation}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-800 text-white px-6 py-3 rounded-xl font-semibold transition"
              >Try Again</button>
            </div>
          ) : (
            <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-6">
              <span className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span className="text-blue-900 dark:text-blue-200 font-medium">Getting your location...</span>
            </div>
          )}
        </section>

        {/* Emergency Numbers */}
        <section className="bg-white/90 dark:bg-slate-900/80 shadow-xl rounded-2xl border border-red-100 dark:border-rose-800/60 backdrop-blur-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-4">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-3 rounded-full">
              <Phone className="h-6 w-6 text-white" />
            </div>
            Emergency Numbers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {emergencyNumbers.map((emergency, idx) => {
              const Icon = emergency.icon;
              return (
                <div key={idx} className="group bg-white/70 dark:bg-slate-800/80 border border-white/40 dark:border-rose-900/30 shadow-xl rounded-xl p-6 hover:shadow-2xl transition hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <span className={`bg-gradient-to-r ${emergency.color} p-3 rounded-full shadow-lg`}><Icon className="h-6 w-6 text-white" /></span>
                      <div>
                        <span className="block font-bold text-lg text-slate-900 dark:text-white">{emergency.name}</span>
                        <span className="block text-2xl font-black bg-gradient-to-r from-red-600 to-rose-700 bg-clip-text text-transparent">
                          {emergency.number}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard(emergency.number)}
                        className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900 rounded-full transition"
                        title="Copy number"
                      >
                        {copiedNumber === emergency.number ?
                          <Check className="h-5 w-5 text-emerald-600" /> :
                          <Copy className="h-5 w-5 text-rose-400 group-hover:text-rose-600" />}
                      </button>
                      <button
                        onClick={() => callEmergencyNumber(emergency.number)}
                        className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow transition hover:scale-105"
                      ><Phone className="h-4 w-4" />Call</button>
                    </div>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 text-base">{emergency.description}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white/90 dark:bg-slate-900/80 shadow-xl rounded-2xl border border-indigo-100 dark:border-indigo-900/60 backdrop-blur-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <button
                  key={idx}
                  onClick={action.action}
                  className={`group bg-gradient-to-r ${action.color} hover:shadow-xl text-white p-6 rounded-xl transition-all duration-300 flex justify-between items-center overflow-hidden`}
                >
                  <span className="flex items-center gap-4">
                    <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Icon className="h-6 w-6" /></span>
                    <span className="font-semibold text-lg">{action.name}</span>
                  </span>
                  <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </button>
              );
            })}
          </div>
        </section>

        {/* Safety Guidelines */}
        <section className="bg-white/90 dark:bg-slate-900/80 shadow-xl rounded-2xl border border-emerald-100 dark:border-emerald-700/50 backdrop-blur-xl p-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Safety Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/20 shadow">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg"><AlertTriangle className="h-5 w-5 text-white" /></span>
                Emergency Protocol
              </h3>
              <ul className="space-y-3 text-slate-800 dark:text-slate-300 text-base pl-2">
                {[
                  "Stay calm and assess the situation carefully",
                  "Call the appropriate emergency number immediately",
                  "Provide your exact location and situation details",
                  "Follow the emergency operator's instructions precisely",
                  "Stay on the line until professional help arrives"
                ].map((tip, i) => (
                  <li className="flex gap-3" key={i}><div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />{tip}</li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/20 rounded-xl p-6 border border-emerald-100 dark:border-emerald-800/20 shadow">
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <span className="bg-gradient-to-r from-emerald-500 to-green-600 p-2 rounded-lg"><Shield className="h-5 w-5 text-white" /></span>
                Preparedness Tips
              </h3>
              <ul className="space-y-3 text-slate-800 dark:text-slate-300 text-base pl-2">
                {[
                  "Keep emergency contacts readily accessible",
                  "Share location with trusted family members",
                  "Maintain your phone charge above 20%",
                  "Keep medical information and allergies documented",
                  "Always trust your instincts in potentially dangerous situations"
                ].map((tip, i) => (
                  <li className="flex gap-3" key={i}><div className="w-2 h-2 bg-emerald-500 rounded-full mt-2" />{tip}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 bg-gradient-to-r from-rose-50 via-red-50 to-rose-50 dark:from-red-900/10 dark:via-rose-900/10 dark:to-red-900/10 border border-rose-100 dark:border-rose-700/20 shadow rounded-xl p-6 flex items-center gap-4">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400 animate-pulse" />
            </div>
            <div className="text-rose-900 dark:text-rose-200 font-semibold text-lg">
              If you're in immediate danger, call emergency services right away. This app helps, but professional emergency response must be your priority.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SOSPage;
