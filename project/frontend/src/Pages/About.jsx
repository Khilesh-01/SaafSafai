// src/components/About.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "./About.css";
import mission from "../assets/mission.png";
import {
  Users,
  Globe,
  Heart,
  Target,
  Zap,
  Shield,
  Award,
  Smartphone,
} from "lucide-react";

function About() {
  const [isDarkMode, setIsDarkMode] = useState(
    () =>
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [activeFeature, setActiveFeature] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const learnMoreRef = useRef(null);

  useEffect(() => {
    if (showMore && learnMoreRef.current) {
      setTimeout(() => {
        learnMoreRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        AOS.refresh();
      }, 60);
    }
  }, [showMore]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,
      mirror: true,
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setIsDarkMode(mq.matches);
    mq.addEventListener && mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener && mq.removeEventListener("change", handleChange);
    };
  }, []);

  const features = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "Community Building",
      description: "Connect with citizens in your locality",
      details:
        "Strengthen neighborhoods through verified issues and collective action.",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "City-wide Impact",
      description: "Solve issues beyond your street",
      details:
        "Your reports contribute to a transparent, city-level civic system.",
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Public Good",
      description: "Problems that matter",
      details:
        "AI prioritization ensures authorities focus on real civic pain points.",
    },
    {
      icon: <Target className="w-7 h-7" />,
      title: "Issue Tracking",
      description: "Track complaints end-to-end",
      details:
        "Monitor status, resolution time, and accountability in real time.",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Fast Reporting",
      description: "Raise issues in seconds",
      details:
        "Minimal steps, geo-tagging, and media uploads for instant action.",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Verified Complaints",
      description: "No spam, no noise",
      details:
        "Every complaint is validated to ensure seriousness and legitimacy.",
    },
    {
      icon: <Award className="w-7 h-7" />,
      title: "Civic Recognition",
      description: "Be a responsible citizen",
      details:
        "Earn badges and recognition for consistent civic participation.",
    },
    {
      icon: <Smartphone className="w-7 h-7" />,
      title: "Web First",
      description: "Accessible everywhere",
      details:
        "Optimized for web with future-ready mobile extensions.",
    },
  ];

  return (
    <div className={`about-container ${isDarkMode ? "dark-mode" : "light-mode"}`}>
      <div className="content-wrapper">
        {/* HERO */}
        <section className="hero-section" data-aos="fade-up">
          <div className="hero-content">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="hero-badge bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
            >
              ✦ Building Trust in Civic Systems
            </motion.div>

            <h1 className="hero-title text-slate-900 dark:text-slate-100">
              Make Your City Better.
              <br />
              <span className="gradient-text bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                Report Local Issues.
              </span>
            </h1>

            <p className="hero-description text-slate-600 dark:text-slate-300">
              saafsafai enables citizens to report and track civic issues like
              potholes, lighting, waste, and sanitation with transparency and
              accountability.
            </p>

            <div className="hero-cta">
              <Link to="/signup">
                <button className="cta-primary bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
                  Get Started
                </button>
              </Link>
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-indigo-600 dark:text-indigo-400"
              >
                {showMore ? "Show Less" : "Learn More"}
              </button>
            </div>
          </div>
        </section>

        {/* EXPANDABLE */}
        <AnimatePresence>
          {showMore && (
            <motion.div
              ref={learnMoreRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="mt-12 space-y-20"
            >
              {/* FEATURES */}
              <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl font-bold text-center mb-16 text-slate-900 dark:text-slate-100">
                    Everything you need for
                    <span className="block text-indigo-500">
                      effective civic action
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                      <div
                        key={i}
                        onMouseEnter={() => setActiveFeature(i)}
                        onMouseLeave={() => setActiveFeature(null)}
                        className={`p-6 rounded-2xl border transition-all cursor-pointer
                          ${activeFeature === i
                            ? "bg-slate-900 text-white border-indigo-500 shadow-xl"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                          }`}
                      >
                        <div className="mb-4 w-14 h-14 rounded-xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
                          {f.icon}
                        </div>
                        <h3 className="font-semibold mb-2">{f.title}</h3>
                        <p className="text-sm opacity-80">{f.description}</p>
                        {activeFeature === i && (
                          <p className="text-xs mt-3 opacity-90">
                            {f.details}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* WHY */}
              <section className="py-16 px-6 rounded-2xl bg-gradient-to-r from-indigo-700 to-violet-700 text-white">
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-4xl font-bold mb-4">
                    Why Choose saafsafai?
                  </h2>
                  <p className="text-lg opacity-90 leading-relaxed">
                    We bridge the gap between citizens and civic authorities by
                    making reporting structured, transparent, and actionable.
                  </p>
                </div>
              </section>

              {/* MISSION */}
              <section className="mission-vision-section">
                <div className="mv-container">
                  <div className="mv-text">
                    <h2 className="section-title">Our Mission</h2>
                    <p>
                      Empower citizens to improve cities through transparent,
                      accountable civic reporting.
                    </p>
                    <h2 className="section-title">Our Vision</h2>
                    <p>
                      A future where governments and citizens collaborate
                      seamlessly for cleaner, safer cities.
                    </p>
                  </div>
                  <div className="mv-image">
                    <img src={mission} alt="Mission" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default About;
