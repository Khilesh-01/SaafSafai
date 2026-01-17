import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const handleGoBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = '/';
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 px-4 text-center overflow-hidden">

      {/* Background Circle */}
      <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-emerald-300 to-teal-400 rounded-full opacity-20 animate-pulse top-[10%] bottom-[40%] transform -translate-x-1/2 -translate-y-1/2 z-0"></div>

      {/* Character */}
      <div className="relative z-10 flex flex-col items-center mt-7">
        <div className="relative animate-bounce flex flex-col items-center">
          {/* Body */}
          <div className="w-32 h-40 bg-emerald-400 rounded-t-full relative shadow-md">
            {/* Eyes */}
            <div className="absolute top-8 left-6 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-8 right-6 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-9 left-7 w-1 h-1 bg-black rounded-full"></div>
            <div className="absolute top-9 right-7 w-1 h-1 bg-black rounded-full"></div>

            {/* Mouth */}
            <div className="absolute top-14 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-red-400 rounded-full"></div>

            {/* Arms */}
            <div className="absolute top-16 -left-4 w-8 h-3 bg-emerald-400 rounded-full transform -rotate-12"></div>
            <div className="absolute top-16 -right-4 w-8 h-3 bg-emerald-400 rounded-full transform rotate-12"></div>

            {/* Horns */}
            <div className="absolute -top-2 left-8 w-3 h-6 bg-emerald-300 rounded-t-full transform -rotate-12"></div>
            <div className="absolute -top-2 right-8 w-3 h-6 bg-emerald-300 rounded-t-full transform rotate-12"></div>

            {/* Speech Bubble */}
            <div className="absolute -top-9 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold rotate-3 shadow-md animate-pulse z-20">
              Oops!
            </div>
          </div>

          {/* Legs */}
          <div className="flex justify-center gap-4 -mt-2">
            <div className="w-4 h-8 bg-gray-600 rounded-b-full"></div>
            <div className="w-4 h-8 bg-gray-600 rounded-b-full"></div>
          </div>

          {/* Feet */}
          <div className="flex justify-center gap-2 -mt-1">
            <div className="w-6 h-3 bg-emerald-400 rounded-full"></div>
            <div className="w-6 h-3 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Text and Buttons Section */}
      <div className="z-10 max-w-md">
        <div className="text-6xl md:text-8xl font-extrabold text-emerald-700 mb-2 opacity-30 select-none">
          404
        </div>

        <h1 className="text-2xl md:text-4xl font-bold text-emerald-700 mb-3">
          Page Not Found
        </h1>

        <p className="text-gray-600 text-base md:text-lg mb-6">
          The page you're looking for doesn't exist or has been moved.
          Don’t worry, let's get you back on track!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-md"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>

          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-emerald-500 text-emerald-600 bg-white rounded-lg hover:bg-gray-50 transition shadow-md"
          >
            <Home size={20} />
            Home Page
          </button>
        </div>
      </div>

      {/* Decorative Ping Dots */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-emerald-300 rounded-full opacity-40 animate-ping"></div>
      <div className="absolute top-20 right-20 w-2 h-2 bg-teal-400 rounded-full opacity-40 animate-ping delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-emerald-400 rounded-full opacity-40 animate-ping delay-2000"></div>
    </div>
  );
};

export default NotFound;
