import React, { useState, useEffect } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaExclamationCircle } from "react-icons/fa";

import { motion } from "framer-motion";
import 'react-toastify/dist/ReactToastify.css';
import loginImage from "../assets/signup.png"; 

const Login = () => {
  const { signIn, setActive } = useSignIn();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [pendingSignIn, setPendingSignIn] = useState(null);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState({});

  useEffect(() => {
    if (email === '') {
      setErrors(p => ({ ...p, email: null }));
      setIsValid(p => ({ ...p, email: false }));
    } else if (/\S+@\S+\.\S+/.test(email)) {
      setErrors(p => ({ ...p, email: null }));
      setIsValid(p => ({ ...p, email: true }));
    } else {
      setErrors(p => ({ ...p, email: 'Please enter a valid email' }));
      setIsValid(p => ({ ...p, email: false }));
    }
  }, [email]);

  useEffect(() => {
    // Only clear the "required" error, not API errors
    if (code && errors.code === 'Verification code is required') {
      setErrors(p => ({ ...p, code: null }));
    }
    if (code) {
      setIsValid(p => ({ ...p, code: true }));
    } else {
      setIsValid(p => ({ ...p, code: false }));
    }
  }, [code, errors.code]);


  // Step 1: Request magic code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors(p => ({ ...p, email: 'Email is required' }));
      setIsValid(p => ({ ...p, email: false }));
      return;
    }
    if (!isValid.email) return;

    try {
      const result = await signIn.create({
        identifier: email,
        strategy: 'email_code'
      });
      setPendingSignIn(result);
      setStep(2);
      toast.info("📩 Verification code sent to your email");
    } catch (err) {
      toast.error(err.errors?.[0]?.message || "Failed to send code");
    }
  };


  // Step 2: Verify code
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) {
      setErrors(p => ({ ...p, code: 'Verification code is required' }));
      setIsValid(p => ({ ...p, code: false }));
      return;
    }
    if (!isValid.code) return;

    try {
      const result = await pendingSignIn.attemptFirstFactor({
        strategy: 'email_code',
        code
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        toast.success("🎉 Login Successful");
        setTimeout(() => navigate('/home'), 1000);
      }
    } catch (err) {
      const errorMessage = "Verification code is wrong.";
      toast.error(errorMessage);
      setErrors(p => ({ ...p, code: errorMessage }));
      setIsValid(p => ({ ...p, code: false }));
    }

  };



  // OAuth Sign In
  const handleOAuthSignIn = async (provider) => {
    await signIn.authenticateWithRedirect({
      strategy: `oauth_${provider}`,
      redirectUrl: '/home',
      redirectUrlComplete: '/home'
    });
  };

  const emailBorderColor = errors.email
    ? '#ef4444' // red-500
    : isValid.email
    ? '#22c55e' // green-500
    : '#86efac'; // green-300

  const codeBorderColor = errors.code
    ? '#ef4444' // red-500
    : isValid.code
    ? '#22c55e' // green-500
    : '#86efac'; // green-300

  return (

    <div 
      className="flex flex-col md:flex-row min-h-screen items-center justify-center font-inter relative"
      
    >
        {/* Left Side - Image */}
        <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 justify-center items-center bg-transparent"
        >
        <motion.img
            src={loginImage}
            alt="Login Illustration"
            className="w-full h-[80vh] object-contain drop-shadow-2xl rounded-xl"
            animate={{
            y: [0, -25, 0],
            }}
            transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
            }}
        />
        </motion.div>
        {/* Right Side - Login Form */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2 w-full flex justify-center"
            
        >
            <div className="rounded-2xl border border-green-500 bg-white/70 backdrop-blur-md p-8 shadow-2xl md:p-10 w-full max-w-md" style={{
            background: 'rgba(34,197,94,0.15)',
            backdropFilter: 'blur(10px)'
        }}>
            
            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-2 text-green-700">
                Welcome Back
            </h2>
            <p className="text-center text-sm text-gray-600 mb-6">
                Sign in to access your account
            </p>

            {/* Step 1: Enter Email */}
            {step === 1 && (
                <motion.form
                noValidate
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleEmailSubmit}
                className="space-y-4"
                >

                <div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-lg p-3 outline-none bg-white/80 text-black"
                        style={{
                            border: `1px solid ${emailBorderColor}`,
                            transition: 'border-color 0.2s'
                        }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {errors.email && (
                        <p className="text-red-500 text-sm flex items-center pt-1">

                            <FaExclamationCircle className="mr-1" />
                            {errors.email}
                        </p>
                    )}
                </div>



                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-medium transition"
                >
                    Continue
                </button>
                </motion.form>
            )}

            {/* Step 2: Enter Code */}
            {step === 2 && (
                <motion.form
                noValidate
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleCodeSubmit}
                className="space-y-4"
                >

                <div>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        className="w-full rounded-lg p-3 outline-none bg-white/80 text-black"
                        style={{
                            border: `1px solid ${codeBorderColor}`,
                            transition: 'border-color 0.2s'
                        }}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    {errors.code && (
                        <p className="text-red-500 text-sm flex items-center pt-1">

                            <FaExclamationCircle className="mr-1" />
                            {errors.code}
                        </p>
                    )}
                </div>



                <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg py-2 font-medium transition"
                >
                    Verify & Continue
                </button>
                </motion.form>
            )}

            {/* Divider */}
            <div className="my-6 flex items-center">
                <hr className="flex-grow border-green-300" />
                <span className="px-3 text-sm text-gray-500">OR</span>
                <hr className="flex-grow border-green-300" />
            </div>

            {/* OAuth Buttons */}
            <div className="space-y-3">
                <button
                onClick={() => handleOAuthSignIn('google')}
                className="w-full flex items-center justify-center gap-3 border border-green-500 rounded-lg py-2 hover:bg-green-500 hover:text-white transition bg-white/80 text-black"
                >
                <FcGoogle size={20} />
                Continue with Google
                </button>
                <button
                onClick={() => handleOAuthSignIn('github')}
                className="w-full flex items-center justify-center gap-3 border border-green-500 rounded-lg py-2 hover:bg-green-500 hover:text-white transition bg-white/80 text-black"
                >
                <FaGithub size={20} />
                Continue with GitHub
                </button>
            </div>

            {/* Footer */}
            <div className="text-center pt-6">
                <Link
                to="/"
                className="inline-block text-sm text-green-700 hover:underline"
                >
                ← Back to Home
                </Link>
                <p className="text-sm text-gray-300 mt-4">
                    Don’t have an account?{' '}
                    <Link to="/signup" className="text-green-700 hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>

          {/* Admin Login */}
          <div className="pt-4 text-center">
            <p className="text-sm text-gray-300 mb-2">
              Are you an administrator?
            </p>
            <Link
              to="/admin/login"
              className="inline-block w-full border border-green-600  font-medium rounded-lg py-2 bg-green-600 text-white transition"
            >
              Login as Admin
            </Link>
          </div>

            </div>
        </motion.div>

        {/* Toast */}
        <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;
